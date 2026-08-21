import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

const TARGET_EMAIL = "bellisima@demo.com.uy";
const DEMO_SOURCE = "demo-seed";
const APPOINTMENT_COUNT = 18;
const CUSTOMER_NAMES = [
  "Sofía Martínez",
  "Valentina Rodríguez",
  "Camila Fernández",
  "Lucía González",
  "Martina Silva",
  "Florencia Pereira",
  "Agustina Torres",
  "Carolina Méndez",
  "Mariana López",
  "Paula Castro",
  "Natalia Ramírez",
  "Emilia Suárez",
];
const CUSTOMER_PHONES = [
  "099 421 735",
  "098 562 184",
  "097 318 902",
  "096 745 221",
  "095 683 417",
];

const getRequiredEnv = (name) => {
  const value = process.env[name]
    ?.replace(/^"|"$/g, "")
    .replace(/\\n/g, "\n")
    .trim();
  if (!value) throw new Error(`Falta la variable ${name}`);
  return value;
};

const getFirebaseApp = () => {
  if (getApps().length > 0) return getApps()[0];
  return initializeApp({
    credential: cert({
      projectId: getRequiredEnv("FIREBASE_PROJECT_ID"),
      clientEmail: getRequiredEnv("FIREBASE_CLIENT_EMAIL"),
      privateKey: getRequiredEnv("FIREBASE_PRIVATE_KEY"),
    }),
  });
};

const toDateString = (date) => date.toISOString().slice(0, 10);
const getDayIndex = (date) => (date.getDay() === 0 ? 6 : date.getDay() - 1);
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const getAvailableServices = (services, specialistId) =>
  services.filter(
    (service) =>
      service.active !== false &&
      (!service.specialistIds?.length || service.specialistIds.includes(specialistId)),
  );

const buildAppointments = (specialists, services) => {
  const activeSpecialists = specialists.filter(
    (specialist) => specialist.active !== false,
  );
  if (!activeSpecialists.length) {
    throw new Error("El centro no tiene especialistas activas disponibles");
  }
  if (!services.length) throw new Error("El centro no tiene servicios configurados");

  const appointments = [];
  const startTimes = ["09:00", "10:30", "12:00", "14:30", "16:00", "18:00"];
  const today = new Date();

  for (let index = 0; index < APPOINTMENT_COUNT; index += 1) {
    const specialist = activeSpecialists[index % activeSpecialists.length];
    const compatibleServices = getAvailableServices(services, specialist.id);
    const service = compatibleServices[index % compatibleServices.length] || services[0];
    const date = addDays(today, 1 + (index % 21));
    const status = index % 5 === 0 ? "done" : index % 3 === 0 ? "confirmed" : "pending";
    const price = Number(service.specialistPrices?.[specialist.id] || service.price) || 0;
    const duration = Number(service.specialistTimes?.[specialist.id] || service.time) || 60;

    appointments.push({
      id: `demo-${Date.now()}-${index}`,
      customer: CUSTOMER_NAMES[index % CUSTOMER_NAMES.length],
      phone: CUSTOMER_PHONES[index % CUSTOMER_PHONES.length],
      email: `cliente${index + 1}@demo.com`,
      specialist: specialist.name,
      specialistId: specialist.id,
      service: service.name,
      selectedServiceIds: [service.id],
      start: startTimes[index % startTimes.length],
      date: toDateString(date),
      day: getDayIndex(date),
      duration,
      total: price,
      status,
      paymentMethod: status === "done" ? "cash" : undefined,
      paidAt: status === "done" ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
      source: DEMO_SOURCE,
      isTest: true,
    });
  }

  return appointments;
};

const main = async () => {
  const app = getFirebaseApp();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const user = await auth.getUserByEmail(TARGET_EMAIL);
  const centerRef = db.collection("centros_estetica").doc(user.uid);
  const centerSnapshot = await centerRef.get();

  if (!centerSnapshot.exists) {
    throw new Error(`No existe centros_estetica/${user.uid}`);
  }

  const center = centerSnapshot.data() || {};
  const existingAppointments = center.appointments || [];
  const demoAppointments = buildAppointments(
    center.specialists || [],
    center.services || [],
  );
  const existingDemoCount = existingAppointments.filter(
    (appointment) => appointment.source === DEMO_SOURCE,
  ).length;

  if (existingDemoCount > 0) {
    console.log(
      `No se agregaron citas: ya existen ${existingDemoCount} citas con source=${DEMO_SOURCE}.`,
    );
    return;
  }

  await centerRef.update({
    appointments: FieldValue.arrayUnion(...demoAppointments),
  });

  console.log(`Se agregaron ${demoAppointments.length} citas demo a ${TARGET_EMAIL}.`);
  console.log(`UID: ${user.uid}`);
};

main().catch((error) => {
  console.error("No se pudieron cargar las citas demo:", error.message);
  process.exitCode = 1;
});
