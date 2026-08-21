import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

const TARGET_EMAIL = "bellisima@demo.com.uy";
const DEMO_SOURCE = "demo-seed";

// Cantidad principal para Dahiana
const DAHIANA_APPOINTMENT_COUNT = 50;

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
  "Renata Castro",
  "Bianca Ramírez",
  "Catalina Suárez",
  "Sabrina Torres",
  "Noelia Méndez",
  "Valeria Pereira",
  "Gabriela Castro",
  "María Belén Silva",
  "Nicole Ramírez",
  "Sofía Pereira",
  "Laura Fernández",
  "Mariana Torres",
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
  "091 724 683",
  "098 315 729",
];

const getRequiredEnv = (name) => {
  const value = process.env[name]
    ?.replace(/^"|"$/g, "")
    .replace(/\\n/g, "\n")
    .trim();

  if (!value) {
    throw new Error(`Falta la variable ${name}`);
  }

  return value;
};

const getFirebaseApp = () => {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  return initializeApp({
    credential: cert({
      projectId: getRequiredEnv("FIREBASE_PROJECT_ID"),
      clientEmail: getRequiredEnv("FIREBASE_CLIENT_EMAIL"),
      privateKey: getRequiredEnv("FIREBASE_PRIVATE_KEY"),
    }),
  });
};

const toDateString = (date) => {
  return date.toISOString().slice(0, 10);
};

const getDayIndex = (date) => {
  return date.getDay() === 0 ? 6 : date.getDay() - 1;
};

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const getAvailableServices = (services, specialistId) => {
  return services.filter(
    (service) =>
      service.active !== false &&
      (!service.specialistIds?.length ||
        service.specialistIds.includes(specialistId)),
  );
};

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

const getServiceDuration = (service, specialistId) => {
  return Number(service.specialistTimes?.[specialistId] || service.time) || 60;
};

const getServicePrice = (service, specialistId) => {
  return Number(service.specialistPrices?.[specialistId] || service.price) || 0;
};

const findSpecialist = (specialists, searchName) => {
  const normalizedSearch = searchName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return specialists.find((specialist) => {
    const normalizedName = specialist.name
      ?.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    return normalizedName?.includes(normalizedSearch);
  });
};

const createAppointment = ({
  specialist,
  service,
  customerIndex,
  startMinutes,
  date,
  status,
  appointmentIndex,
  prefix,
}) => {
  const duration = getServiceDuration(service, specialist.id);

  const price = getServicePrice(service, specialist.id);

  const appointment = {
    id: `demo-${prefix}-${Date.now()}-${appointmentIndex}`,

    customer: CUSTOMER_NAMES[customerIndex % CUSTOMER_NAMES.length],

    phone: CUSTOMER_PHONES[customerIndex % CUSTOMER_PHONES.length],

    email: `cliente${customerIndex + 1}@demo.com`,

    specialist: specialist.name,

    specialistId: specialist.id,

    service: service.name,

    selectedServiceIds: [service.id],

    start: minutesToTime(startMinutes),

    date: toDateString(date),

    day: getDayIndex(date),

    duration,

    total: price,

    status,

    createdAt: new Date().toISOString(),

    source: DEMO_SOURCE,

    isTest: true,
  };

  if (status === "done") {
    appointment.paymentMethod =
      appointmentIndex % 3 === 0
        ? "card"
        : appointmentIndex % 3 === 1
          ? "transfer"
          : "cash";

    appointment.paidAt = new Date().toISOString();
  }

  return appointment;
};

const buildDahianaAppointments = (dahiana, services, today) => {
  const appointments = [];

  const availableServices = getAvailableServices(services, dahiana.id);

  if (!availableServices.length) {
    throw new Error("Dahiana Vázquez no tiene servicios disponibles.");
  }

  let appointmentIndex = 0;

  /*
   * Horario de la estética:
   *
   * 09:00
   * 10:00
   * 11:30
   * 13:00
   * 14:30
   * 16:00
   * 17:30
   * 19:00
   *
   * El horario real se calcula según duración.
   */

  const OPENING_TIME = 9 * 60;
  const CLOSING_TIME = 20 * 60;

  for (
    let dayOffset = 1;
    dayOffset <= 21 && appointments.length < DAHIANA_APPOINTMENT_COUNT;
    dayOffset++
  ) {
    const date = addDays(today, dayOffset);

    const dayIndex = getDayIndex(date);

    // Domingo libre
    if (dayIndex === 6) {
      continue;
    }

    let currentTime = OPENING_TIME;

    /*
     * Viernes y sábado más cargados.
     */

    let appointmentsToday;

    if (dayIndex === 4) {
      appointmentsToday = 6;
    } else if (dayIndex === 5) {
      appointmentsToday = 7;
    } else if (dayIndex === 2) {
      appointmentsToday = 5;
    } else {
      appointmentsToday = 4;
    }

    let dailyCount = 0;

    while (
      dailyCount < appointmentsToday &&
      appointments.length < DAHIANA_APPOINTMENT_COUNT
    ) {
      const service =
        availableServices[appointmentIndex % availableServices.length];

      const duration = getServiceDuration(service, dahiana.id);

      /*
       * No permitir turnos después del cierre.
       */

      if (currentTime + duration > CLOSING_TIME) {
        break;
      }

      let status;

      if (appointmentIndex % 6 === 0) {
        status = "done";
      } else if (appointmentIndex % 3 === 0) {
        status = "confirmed";
      } else {
        status = "pending";
      }

      const appointment = createAppointment({
        specialist: dahiana,
        service,
        customerIndex: appointmentIndex,
        startMinutes: currentTime,
        date,
        status,
        appointmentIndex,
        prefix: "dahiana",
      });

      appointments.push(appointment);

      /*
       * Dejamos 15 minutos entre clientas.
       */

      currentTime += duration + 15;

      dailyCount++;
      appointmentIndex++;
    }
  }

  return appointments;
};

const buildLuciaAppointments = (lucia, services, today) => {
  if (!lucia) {
    return [];
  }

  const appointments = [];

  const availableServices = getAvailableServices(services, lucia.id);

  if (!availableServices.length) {
    throw new Error("Lucía Pérez no tiene servicios disponibles.");
  }

  const OPENING_TIME = 9 * 60;
  const CLOSING_TIME = 19 * 60;

  let appointmentIndex = 0;

  /*
   * Lucía tendrá una agenda más variada.
   */

  for (let dayOffset = 1; dayOffset <= 18; dayOffset++) {
    const date = addDays(today, dayOffset);

    const dayIndex = getDayIndex(date);

    if (dayIndex === 6) {
      continue;
    }

    let currentTime = OPENING_TIME;

    /*
     * Algunos días 3 citas,
     * otros 4 y viernes 5.
     */

    const appointmentsToday = dayIndex === 4 ? 5 : dayIndex === 2 ? 4 : 3;

    let dailyCount = 0;

    while (dailyCount < appointmentsToday) {
      const service =
        availableServices[appointmentIndex % availableServices.length];

      const duration = getServiceDuration(service, lucia.id);

      if (currentTime + duration > CLOSING_TIME) {
        break;
      }

      let status;

      if (appointmentIndex % 5 === 0) {
        status = "done";
      } else if (appointmentIndex % 2 === 0) {
        status = "confirmed";
      } else {
        status = "pending";
      }

      const appointment = createAppointment({
        specialist: lucia,
        service,
        customerIndex: appointmentIndex + 15,
        startMinutes: currentTime,
        date,
        status,
        appointmentIndex,
        prefix: "lucia",
      });

      appointments.push(appointment);

      currentTime += duration + 15;

      dailyCount++;
      appointmentIndex++;
    }
  }

  return appointments;
};

const main = async () => {
  try {
    console.log("Iniciando carga de agenda demo...");

    const app = getFirebaseApp();

    const auth = getAuth(app);

    const db = getFirestore(app);

    /*
     * Buscar usuario por email.
     */

    const user = await auth.getUserByEmail(TARGET_EMAIL);

    console.log(`Usuario encontrado: ${user.uid}`);

    /*
     * Documento del centro.
     */

    const centerRef = db.collection("centros_estetica").doc(user.uid);

    const centerSnapshot = await centerRef.get();

    if (!centerSnapshot.exists) {
      throw new Error(`No existe centros_estetica/${user.uid}`);
    }

    const center = centerSnapshot.data() || {};

    const existingAppointments = center.appointments || [];

    const specialists = center.specialists || [];

    const services = center.services || [];

    if (!specialists.length) {
      throw new Error("El centro no tiene especialistas configuradas.");
    }

    if (!services.length) {
      throw new Error("El centro no tiene servicios configurados.");
    }

    console.log(`Especialistas encontradas: ${specialists.length}`);

    console.log(`Servicios encontrados: ${services.length}`);

    /*
     * Buscar Dahiana.
     */

    const dahiana = findSpecialist(specialists, "Dahiana Vazquez");

    if (!dahiana) {
      throw new Error("No se encontró a Dahiana Vázquez.");
    }

    /*
     * Buscar Lucía.
     */

    const lucia = findSpecialist(specialists, "Lucia Perez");

    console.log(`Dahiana encontrada: ${dahiana.name}`);

    if (lucia) {
      console.log(`Lucía encontrada: ${lucia.name}`);
    } else {
      console.log(
        "Lucía Pérez no fue encontrada. Se generará solamente la agenda de Dahiana.",
      );
    }

    /*
     * Evitar duplicados.
     */

    const existingDemoAppointments = existingAppointments.filter(
      (appointment) => appointment.source === DEMO_SOURCE,
    );

    const realAppointments = existingAppointments.filter(
      (appointment) => appointment.source !== DEMO_SOURCE,
    );

    console.log(
      `Citas demo anteriores encontradas: ${existingDemoAppointments.length}`,
    );

    console.log(`Citas reales que se conservarán: ${realAppointments.length}`);

    if (existingDemoAppointments.length > 0) {
      console.log(`Ya existen ${existingDemoAppointments.length} citas demo.`);

      console.log("No se agregaron nuevas citas.");

      return;
    }

    const today = new Date();

    /*
     * Crear agenda de Dahiana.
     */

    const dahianaAppointments = buildDahianaAppointments(
      dahiana,
      services,
      today,
    );

    /*
     * Crear agenda de Lucía.
     */

    const luciaAppointments = buildLuciaAppointments(lucia, services, today);

    const demoAppointments = [...dahianaAppointments, ...luciaAppointments];

    if (!demoAppointments.length) {
      throw new Error("No se pudieron generar citas demo.");
    }

    /*
     * Agregar todo al array appointments.
     */

    await centerRef.update({
      appointments: FieldValue.arrayUnion(...demoAppointments),
    });

    console.log("======================================");

    console.log("AGENDA DEMO CARGADA CORRECTAMENTE");

    console.log("======================================");

    console.log(`Dahiana: ${dahianaAppointments.length} citas`);

    console.log(`Lucía: ${luciaAppointments.length} citas`);

    console.log(`TOTAL: ${demoAppointments.length} citas`);

    console.log(`Centro: ${TARGET_EMAIL}`);

    console.log(`UID: ${user.uid}`);

    console.log("======================================");
  } catch (error) {
    console.error("No se pudieron cargar las citas demo:", error);

    process.exitCode = 1;
  }
};

main();
