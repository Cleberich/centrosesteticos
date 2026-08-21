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
      (!service.specialistIds?.length ||
        service.specialistIds.includes(specialistId)),
  );

const APPOINTMENT_COUNT = 50;

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
  "Victoria Fernández",
  "Micaela Rodríguez",
  "Julieta Pereira",
  "Antonella Silva",
  "Daniela Martínez",
  "Milagros González",
  "Agustina López",
  "Renata Castro",
  "Bianca Ramírez",
  "Catalina Suárez",
  "Sabrina Torres",
  "Noelia Méndez",
  "Valeria Pereira",
];

const CUSTOMER_PHONES = [
  "099 421 735",
  "098 562 184",
  "097 318 902",
  "096 745 221",
  "095 683 417",
  "094 827 316",
  "093 651 284",
  "092 438 715",
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
      (!service.specialistIds?.length ||
        service.specialistIds.includes(specialistId)),
  );

const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");

  const mins = (minutes % 60).toString().padStart(2, "0");

  return `${hours}:${mins}`;
};

const buildAppointments = (specialists, services) => {
  const activeSpecialists = specialists.filter(
    (specialist) => specialist.active !== false,
  );

  if (!activeSpecialists.length) {
    throw new Error("El centro no tiene especialistas activas disponibles");
  }

  if (!services.length) {
    throw new Error("El centro no tiene servicios configurados");
  }

  /*
   * Buscamos específicamente a las especialistas.
   * Se aceptan pequeñas diferencias de mayúsculas/minúsculas.
   */

  const lucia = activeSpecialists.find(
    (specialist) =>
      specialist.name?.toLowerCase().includes("lucia") ||
      specialist.name?.toLowerCase().includes("lucía"),
  );

  const dahiana = activeSpecialists.find((specialist) =>
    specialist.name?.toLowerCase().includes("dahiana"),
  );

  if (!dahiana) {
    throw new Error("No se encontró una especialista llamada Dahiana Vázquez");
  }

  /*
   * Servicios disponibles para cada especialista.
   */

  const dahianaServices = getAvailableServices(services, dahiana.id);

  const luciaServices = lucia ? getAvailableServices(services, lucia.id) : [];

  if (!dahianaServices.length) {
    throw new Error("Dahiana Vázquez no tiene servicios disponibles.");
  }

  if (lucia && !luciaServices.length) {
    throw new Error("Lucía Pérez no tiene servicios disponibles.");
  }

  const appointments = [];

  /*
   * Horario comercial de la estética.
   *
   * En lugar de usar solamente 09:00, 10:30, etc.,
   * vamos avanzando según la duración real del servicio.
   */

  const OPENING_TIME = 9 * 60;
  const CLOSING_TIME = 19 * 60;

  /*
   * ---------------------------------------------------------
   * DAHIANA
   * ---------------------------------------------------------
   *
   * 50 turnos.
   *
   * Se distribuyen durante 21 días.
   */

  let dahianaCount = 0;

  const today = new Date();

  for (let dayOffset = 1; dayOffset <= 21 && dahianaCount < 50; dayOffset++) {
    const date = addDays(today, dayOffset);

    /*
     * No llenar demasiado los domingos.
     * 0 = lunes, 6 = domingo.
     */

    const dayIndex = getDayIndex(date);

    if (dayIndex === 6) continue;

    let currentTime = OPENING_TIME;

    /*
     * Algunos días tendrán más carga que otros.
     * Esto hace que la agenda parezca más natural.
     */

    const appointmentsToday =
      dayIndex === 5 ? 5 : dayIndex === 4 ? 6 : dayIndex === 2 ? 5 : 4;

    let dailyCount = 0;

    while (dailyCount < appointmentsToday && dahianaCount < 50) {
      const service = dahianaServices[dahianaCount % dahianaServices.length];

      const duration =
        Number(service.specialistTimes?.[dahiana.id] || service.time) || 60;

      const price =
        Number(service.specialistPrices?.[dahiana.id] || service.price) || 0;

      /*
       * Si el servicio no entra antes del cierre,
       * buscamos el siguiente bloque.
       */

      if (currentTime + duration > CLOSING_TIME) {
        break;
      }

      const status =
        dahianaCount % 7 === 0
          ? "done"
          : dahianaCount % 3 === 0
            ? "confirmed"
            : "pending";

      const appointment = {
        id: `demo-dahiana-${Date.now()}-${dahianaCount}`,

        customer: CUSTOMER_NAMES[dahianaCount % CUSTOMER_NAMES.length],

        phone: CUSTOMER_PHONES[dahianaCount % CUSTOMER_PHONES.length],

        email: `cliente${dahianaCount + 1}@demo.com`,

        specialist: dahiana.name,
        specialistId: dahiana.id,

        service: service.name,

        selectedServiceIds: [service.id],

        start: minutesToTime(currentTime),

        date: toDateString(date),

        day: dayIndex,

        duration,

        total: price,

        status,

        createdAt: new Date().toISOString(),

        source: DEMO_SOURCE,

        isTest: true,
      };

      if (status === "done") {
        appointment.paymentMethod =
          dahianaCount % 2 === 0 ? "cash" : "transfer";

        appointment.paidAt = new Date().toISOString();
      }

      appointments.push(appointment);

      dahianaCount++;
      dailyCount++;

      /*
       * Pequeño espacio entre clientas.
       */

      currentTime += duration + 15;
    }
  }

  /*
   * ---------------------------------------------------------
   * LUCÍA PÉREZ
   * ---------------------------------------------------------
   *
   * Generamos una agenda adicional con distintos servicios.
   */

  if (lucia) {
    let luciaCount = 0;

    for (let dayOffset = 1; dayOffset <= 14; dayOffset++) {
      const date = addDays(today, dayOffset);
      const dayIndex = getDayIndex(date);

      if (dayIndex === 6) continue;

      let currentTime = 9 * 60;

      /*
       * 3 a 5 clientas por día para Lucía.
       */

      const appointmentsToday = dayIndex === 5 ? 5 : dayIndex === 2 ? 4 : 3;

      for (let dailyCount = 0; dailyCount < appointmentsToday; dailyCount++) {
        const service = luciaServices[luciaCount % luciaServices.length];

        const duration =
          Number(service.specialistTimes?.[lucia.id] || service.time) || 60;

        const price =
          Number(service.specialistPrices?.[lucia.id] || service.price) || 0;

        if (currentTime + duration > CLOSING_TIME) {
          break;
        }

        const status =
          luciaCount % 6 === 0
            ? "done"
            : luciaCount % 2 === 0
              ? "confirmed"
              : "pending";

        const appointment = {
          id: `demo-lucia-${Date.now()}-${luciaCount}`,

          customer: CUSTOMER_NAMES[(luciaCount + 8) % CUSTOMER_NAMES.length],

          phone: CUSTOMER_PHONES[(luciaCount + 3) % CUSTOMER_PHONES.length],

          email: `lucia-cliente${luciaCount + 1}@demo.com`,

          specialist: lucia.name,
          specialistId: lucia.id,

          service: service.name,

          selectedServiceIds: [service.id],

          start: minutesToTime(currentTime),

          date: toDateString(date),

          day: dayIndex,

          duration,

          total: price,

          status,

          createdAt: new Date().toISOString(),

          source: DEMO_SOURCE,

          isTest: true,
        };

        if (status === "done") {
          appointment.paymentMethod = luciaCount % 2 === 0 ? "cash" : "card";

          appointment.paidAt = new Date().toISOString();
        }

        appointments.push(appointment);

        luciaCount++;

        currentTime += duration + 15;
      }
    }
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

  console.log(
    `Se agregaron ${demoAppointments.length} citas demo a ${TARGET_EMAIL}.`,
  );
  console.log(`UID: ${user.uid}`);
};

main().catch((error) => {
  console.error("No se pudieron cargar las citas demo:", error.message);
  process.exitCode = 1;
});
