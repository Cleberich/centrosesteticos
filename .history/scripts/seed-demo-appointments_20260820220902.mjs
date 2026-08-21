import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const TARGET_EMAIL = "bellisima@demo.com.uy";
const DEMO_SOURCE = "demo-seed";

const DAHIANA_APPOINTMENT_COUNT = 50;
const LUCIA_APPOINTMENT_COUNT = 30;
const VALENTINA_APPOINTMENT_COUNT = 30;

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
  "Agustina Fernández",
  "Carla Rodríguez",
  "Paola Martínez",
  "Andrea Silva",
  "Romina Pereira",
  "Cecilia González",
  "Natalia Fernández",
  "Pilar Rodríguez",
  "Malena Castro",
  "Ariana López",
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
  "097 481 526",
  "096 372 841",
  "095 214 638",
  "094 563 927",
  "093 728 415",
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

const getServiceDuration = (service, specialistId) => {
  return Number(service.specialistTimes?.[specialistId] || service.time) || 60;
};

const getServicePrice = (service, specialistId) => {
  return Number(service.specialistPrices?.[specialistId] || service.price) || 0;
};

const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");

  const mins = (minutes % 60).toString().padStart(2, "0");

  return `${hours}:${mins}`;
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

const getStatus = (index) => {
  if (index % 6 === 0) {
    return "done";
  }

  if (index % 3 === 0) {
    return "confirmed";
  }

  return "pending";
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
    const paymentMethods = ["cash", "card", "transfer"];

    appointment.paymentMethod =
      paymentMethods[appointmentIndex % paymentMethods.length];

    appointment.paidAt = new Date().toISOString();
  }

  return appointment;
};

/* =========================================================
   DAHIANA
========================================================= */

const buildDahianaAppointments = (dahiana, services, today) => {
  const appointments = [];

  const availableServices = getAvailableServices(services, dahiana.id);

  if (!availableServices.length) {
    throw new Error("Dahiana Vázquez no tiene servicios disponibles.");
  }

  const OPENING_TIME = 9 * 60;
  const CLOSING_TIME = 20 * 60;

  let appointmentIndex = 0;

  for (
    let dayOffset = 1;
    dayOffset <= 30 && appointments.length < DAHIANA_APPOINTMENT_COUNT;
    dayOffset++
  ) {
    const date = addDays(today, dayOffset);

    const dayIndex = getDayIndex(date);

    // Domingo cerrado
    if (dayIndex === 6) {
      continue;
    }

    let currentTime = OPENING_TIME;

    let appointmentsToday;

    // Viernes
    if (dayIndex === 4) {
      appointmentsToday = 6;
    }

    // Sábado
    else if (dayIndex === 5) {
      appointmentsToday = 7;
    }

    // Miércoles
    else if (dayIndex === 2) {
      appointmentsToday = 5;
    }

    // Otros días
    else {
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

      if (currentTime + duration > CLOSING_TIME) {
        break;
      }

      const status = getStatus(appointmentIndex);

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
       * 15 minutos de separación
       * entre clientas.
       */

      currentTime += duration + 15;

      dailyCount++;
      appointmentIndex++;
    }
  }

  return appointments;
};

/* =========================================================
   LUCÍA
========================================================= */

const buildLuciaAppointments = (lucia, services, today) => {
  if (!lucia) {
    return [];
  }

  const appointments = [];

  const availableServices = getAvailableServices(services, lucia.id);

  if (!availableServices.length) {
    console.log("Lucía Pérez no tiene servicios compatibles.");

    return [];
  }

  const OPENING_TIME = 9 * 60;
  const CLOSING_TIME = 19 * 60;

  let appointmentIndex = 0;

  for (
    let dayOffset = 1;
    dayOffset <= 30 && appointments.length < LUCIA_APPOINTMENT_COUNT;
    dayOffset++
  ) {
    const date = addDays(today, dayOffset);

    const dayIndex = getDayIndex(date);

    if (dayIndex === 6) {
      continue;
    }

    let currentTime = OPENING_TIME;

    let appointmentsToday;

    if (dayIndex === 4) {
      appointmentsToday = 5;
    } else if (dayIndex === 5) {
      appointmentsToday = 6;
    } else if (dayIndex === 2) {
      appointmentsToday = 4;
    } else {
      appointmentsToday = 3;
    }

    let dailyCount = 0;

    while (
      dailyCount < appointmentsToday &&
      appointments.length < LUCIA_APPOINTMENT_COUNT
    ) {
      const service =
        availableServices[appointmentIndex % availableServices.length];

      const duration = getServiceDuration(service, lucia.id);

      if (currentTime + duration > CLOSING_TIME) {
        break;
      }

      const status = getStatus(appointmentIndex + 10);

      const appointment = createAppointment({
        specialist: lucia,

        service,

        customerIndex: appointmentIndex + 20,

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

/* =========================================================
   VALENTINA
========================================================= */

const buildValentinaAppointments = (valentina, services, today) => {
  if (!valentina) {
    return [];
  }

  const appointments = [];

  const availableServices = getAvailableServices(services, valentina.id);

  if (!availableServices.length) {
    console.log("Valentina Gómez no tiene servicios compatibles.");

    return [];
  }

  const OPENING_TIME = 9 * 60;
  const CLOSING_TIME = 19 * 60;

  let appointmentIndex = 0;

  for (
    let dayOffset = 1;
    dayOffset <= 30 && appointments.length < VALENTINA_APPOINTMENT_COUNT;
    dayOffset++
  ) {
    const date = addDays(today, dayOffset);

    const dayIndex = getDayIndex(date);

    // Domingo libre
    if (dayIndex === 6) {
      continue;
    }

    let currentTime = OPENING_TIME;

    let appointmentsToday;

    /*
     * Valentina tiene una agenda
     * bastante completa.
     */

    if (dayIndex === 4) {
      appointmentsToday = 5;
    } else if (dayIndex === 5) {
      appointmentsToday = 6;
    } else if (dayIndex === 2) {
      appointmentsToday = 4;
    } else {
      appointmentsToday = 4;
    }

    let dailyCount = 0;

    while (
      dailyCount < appointmentsToday &&
      appointments.length < VALENTINA_APPOINTMENT_COUNT
    ) {
      const service =
        availableServices[appointmentIndex % availableServices.length];

      const duration = getServiceDuration(service, valentina.id);

      if (currentTime + duration > CLOSING_TIME) {
        break;
      }

      const status = getStatus(appointmentIndex + 30);

      const appointment = createAppointment({
        specialist: valentina,

        service,

        customerIndex: appointmentIndex + 50,

        startMinutes: currentTime,

        date,

        status,

        appointmentIndex,

        prefix: "valentina",
      });

      appointments.push(appointment);

      currentTime += duration + 15;

      dailyCount++;
      appointmentIndex++;
    }
  }

  return appointments;
};

/* =========================================================
   MAIN
========================================================= */

const main = async () => {
  try {
    console.log("Iniciando carga de agenda demo...");

    const app = getFirebaseApp();

    const auth = getAuth(app);

    const db = getFirestore(app);

    /*
     * Buscar usuario
     */

    const user = await auth.getUserByEmail(TARGET_EMAIL);

    console.log(`Usuario encontrado: ${user.uid}`);

    /*
     * Centro
     */

    const centerRef = db.collection("centros_estetica").doc(user.uid);

    const centerSnapshot = await centerRef.get();

    if (!centerSnapshot.exists) {
      throw new Error(`No existe centros_estetica/${user.uid}`);
    }

    const center = centerSnapshot.data() || {};

    const existingAppointments = Array.isArray(center.appointments)
      ? center.appointments
      : [];

    const specialists = Array.isArray(center.specialists)
      ? center.specialists
      : [];

    const services = Array.isArray(center.services) ? center.services : [];

    console.log(`Especialistas encontradas: ${specialists.length}`);

    console.log(`Servicios encontrados: ${services.length}`);

    if (!specialists.length) {
      throw new Error("El centro no tiene especialistas.");
    }

    if (!services.length) {
      throw new Error("El centro no tiene servicios configurados.");
    }

    /*
     * Buscar especialistas
     */

    const dahiana = findSpecialist(specialists, "Dahiana Vazquez");

    const lucia = findSpecialist(specialists, "Lucia Perez");

    const valentina = findSpecialist(specialists, "Valentina Gomez");

    if (!dahiana) {
      throw new Error("No se encontró a Dahiana Vázquez.");
    }

    console.log(`Dahiana encontrada: ${dahiana.name}`);

    if (lucia) {
      console.log(`Lucía encontrada: ${lucia.name}`);
    } else {
      console.log("Lucía Pérez no fue encontrada.");
    }

    if (valentina) {
      console.log(`Valentina encontrada: ${valentina.name}`);
    } else {
      console.log("Valentina Gómez no fue encontrada.");
    }

    /*
     * Separar citas demo de citas reales.
     *
     * Las citas reales se conservan.
     * Las citas demo anteriores se reemplazan.
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

    /*
     * Generar nuevas citas
     */

    const today = new Date();

    /*
     * DAHIANA
     */

    const dahianaAppointments = buildDahianaAppointments(
      dahiana,
      services,
      today,
    );

    /*
     * LUCÍA
     */

    const luciaAppointments = buildLuciaAppointments(lucia, services, today);

    /*
     * VALENTINA
     */

    const valentinaAppointments = buildValentinaAppointments(
      valentina,
      services,
      today,
    );

    /*
     * Unir todas las citas demo
     */

    const demoAppointments = [
      ...dahianaAppointments,
      ...luciaAppointments,
      ...valentinaAppointments,
    ];

    if (!demoAppointments.length) {
      throw new Error("No se pudieron generar citas demo.");
    }

    /*
     * Guardar en Firebase.
     *
     * IMPORTANTE:
     * Reemplazamos las citas demo anteriores.
     * Las citas reales permanecen.
     */

    await centerRef.update({
      appointments: [...realAppointments, ...demoAppointments],
    });

    /*
     * Resultado
     */

    console.log("");

    console.log("======================================");

    console.log("AGENDA DEMO CARGADA CORRECTAMENTE");

    console.log("======================================");

    console.log(`Dahiana Vázquez: ${dahianaAppointments.length} citas`);

    console.log(`Lucía Pérez: ${luciaAppointments.length} citas`);

    console.log(`Valentina Gómez: ${valentinaAppointments.length} citas`);

    console.log(`TOTAL CITAS DEMO: ${demoAppointments.length}`);

    console.log(`CITAS REALES CONSERVADAS: ${realAppointments.length}`);

    console.log(
      `TOTAL EN AGENDA: ${realAppointments.length + demoAppointments.length}`,
    );

    console.log(`Centro: ${TARGET_EMAIL}`);

    console.log(`UID: ${user.uid}`);

    console.log("======================================");
  } catch (error) {
    console.error("");

    console.error("======================================");

    console.error("ERROR AL CARGAR AGENDA DEMO");

    console.error("======================================");

    console.error(error.message);

    console.error("======================================");

    process.exitCode = 1;
  }
};

main();
