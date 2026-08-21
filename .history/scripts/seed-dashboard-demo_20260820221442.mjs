import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const TARGET_EMAIL = "bellisima@demo.com.uy";
const DEMO_SOURCE = "dashboard-demo";

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
  "097 481 526",
  "096 372 841",
  "095 214 638",
  "094 563 927",
  "093 728 415",
];

const DEMO_SERVICES = [
  {
    name: "Lifting de pestañas",
    category: "Pestañas",
    duration: 60,
    price: 1200,
  },
  {
    name: "Extensión de pestañas",
    category: "Pestañas",
    duration: 90,
    price: 1800,
  },
  {
    name: "Soft Gel",
    category: "Manicuría",
    duration: 75,
    price: 1500,
  },
  {
    name: "Manicuría semipermanente",
    category: "Manicuría",
    duration: 60,
    price: 1000,
  },
  {
    name: "Limpieza facial",
    category: "Estética",
    duration: 60,
    price: 1400,
  },
  {
    name: "Radiofrecuencia facial",
    category: "Estética",
    duration: 60,
    price: 1600,
  },
  {
    name: "Masaje relajante",
    category: "Estética",
    duration: 60,
    price: 1300,
  },
  {
    name: "Perfilado de cejas",
    category: "Estética",
    duration: 30,
    price: 700,
  },
  {
    name: "Depilación facial",
    category: "Estética",
    duration: 30,
    price: 600,
  },
  {
    name: "Tratamiento corporal",
    category: "Estética",
    duration: 90,
    price: 2200,
  },
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

const formatDate = (date) => {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const addDays = (date, days) => {
  const result = new Date(date);

  result.setDate(result.getDate() + days);

  return result;
};

const getDayIndex = (date) => {
  return date.getDay() === 0 ? 6 : date.getDay() - 1;
};

const getSpecialist = (specialists, searchName) => {
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
  index,
  customerIndex,
  specialist,
  service,
  date,
  start,
  status,
  source = DEMO_SOURCE,
}) => {
  const customer = CUSTOMER_NAMES[customerIndex % CUSTOMER_NAMES.length];

  const phone = CUSTOMER_PHONES[customerIndex % CUSTOMER_PHONES.length];

  const appointment = {
    id: `dashboard-demo-${Date.now()}-${index}`,

    customer,

    phone,

    email: `dashboard${customerIndex + 1}@demo.com`,

    specialist: specialist?.name || "Especialista",

    specialistId: specialist?.id || "",

    service: service.name,

    serviceCategory: service.category,

    selectedServiceIds: [],

    start,

    date: formatDate(date),

    day: getDayIndex(date),

    duration: service.duration,

    total: service.price,

    status,

    createdAt: new Date().toISOString(),

    source,

    isTest: true,
  };

  if (status === "done") {
    const paymentMethods = ["cash", "transfer", "mp", "pos"];

    appointment.paymentMethod = paymentMethods[index % paymentMethods.length];

    appointment.paidAt = new Date(
      date.getTime() + 1000 * 60 * 60 * 12,
    ).toISOString();
  }

  return appointment;
};

const main = async () => {
  try {
    console.log("======================================");

    console.log("SEED DE DASHBOARD");

    console.log("======================================");

    const app = getFirebaseApp();

    const auth = getAuth(app);

    const db = getFirestore(app);

    /*
     * Buscar usuario
     */

    const user = await auth.getUserByEmail(TARGET_EMAIL);

    console.log(`Usuario encontrado: ${user.uid}`);

    /*
     * Documento del centro
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

    console.log(`Especialistas encontradas: ${specialists.length}`);

    /*
     * Buscar especialistas
     */

    const dahiana = getSpecialist(specialists, "Dahiana Vazquez");

    const lucia = getSpecialist(specialists, "Lucia Perez");

    const valentina = getSpecialist(specialists, "Valentina Gomez");

    if (dahiana) {
      console.log(`Dahiana: ${dahiana.name}`);
    }

    if (lucia) {
      console.log(`Lucía: ${lucia.name}`);
    }

    if (valentina) {
      console.log(`Valentina: ${valentina.name}`);
    }

    /*
     * Si alguna no existe,
     * usamos las especialistas disponibles.
     */

    const fallbackSpecialists = specialists.filter(
      (specialist) => specialist.active !== false,
    );

    const specialistDahiana = dahiana || fallbackSpecialists[0];

    const specialistLucia =
      lucia || fallbackSpecialists[1] || fallbackSpecialists[0];

    const specialistValentina =
      valentina || fallbackSpecialists[2] || fallbackSpecialists[0];

    if (!specialistDahiana) {
      throw new Error("No hay especialistas disponibles.");
    }

    /*
     * Eliminar solamente datos
     * generados por este seed.
     *
     * No toca las citas reales.
     */

    const realAppointments = existingAppointments.filter(
      (appointment) => appointment.source !== DEMO_SOURCE,
    );

    const previousDemoAppointments = existingAppointments.filter(
      (appointment) => appointment.source === DEMO_SOURCE,
    );

    console.log(`Datos demo anteriores: ${previousDemoAppointments.length}`);

    console.log(`Citas reales conservadas: ${realAppointments.length}`);

    const today = new Date();

    const demoAppointments = [];

    let index = 0;

    /*
     * ======================================================
     * 1. CITAS PARA HOY
     * ======================================================
     *
     * Estas son las que aparecen directamente
     * en "Agenda del Día".
     */

    console.log("");

    console.log("Creando agenda de hoy...");

    const todayAppointments = [
      {
        specialist: specialistDahiana,

        service: DEMO_SERVICES[0],

        start: "09:00",

        status: "pending",
      },

      {
        specialist: specialistLucia,

        service: DEMO_SERVICES[4],

        start: "09:00",

        status: "confirmed",
      },

      {
        specialist: specialistDahiana,

        service: DEMO_SERVICES[1],

        start: "10:30",

        status: "pending",
      },

      {
        specialist: specialistValentina,

        service: DEMO_SERVICES[2],

        start: "10:00",

        status: "confirmed",
      },

      {
        specialist: specialistLucia,

        service: DEMO_SERVICES[7],

        start: "10:15",

        status: "pending",
      },

      {
        specialist: specialistDahiana,

        service: DEMO_SERVICES[5],

        start: "12:00",

        status: "confirmed",
      },

      {
        specialist: specialistValentina,

        service: DEMO_SERVICES[3],

        start: "11:30",

        status: "pending",
      },

      {
        specialist: specialistLucia,

        service: DEMO_SERVICES[6],

        start: "12:00",

        status: "confirmed",
      },

      {
        specialist: specialistDahiana,

        service: DEMO_SERVICES[6],

        start: "14:30",

        status: "pending",
      },

      {
        specialist: specialistValentina,

        service: DEMO_SERVICES[5],

        start: "14:00",

        status: "confirmed",
      },

      {
        specialist: specialistLucia,

        service: DEMO_SERVICES[8],

        start: "14:30",

        status: "pending",
      },

      {
        specialist: specialistDahiana,

        service: DEMO_SERVICES[2],

        start: "16:00",

        status: "confirmed",
      },

      {
        specialist: specialistValentina,

        service: DEMO_SERVICES[0],

        start: "15:30",

        status: "pending",
      },

      {
        specialist: specialistLucia,

        service: DEMO_SERVICES[9],

        start: "16:00",

        status: "confirmed",
      },

      {
        specialist: specialistDahiana,

        service: DEMO_SERVICES[7],

        start: "17:30",

        status: "pending",
      },

      {
        specialist: specialistValentina,

        service: DEMO_SERVICES[4],

        start: "17:00",

        status: "confirmed",
      },

      {
        specialist: specialistLucia,

        service: DEMO_SERVICES[1],

        start: "17:30",

        status: "pending",
      },

      {
        specialist: specialistDahiana,

        service: DEMO_SERVICES[3],

        start: "19:00",

        status: "confirmed",
      },
    ];

    for (const item of todayAppointments) {
      demoAppointments.push(
        createAppointment({
          index,
          customerIndex: index,

          specialist: item.specialist,

          service: item.service,

          date: today,

          start: item.start,

          status: item.status,
        }),
      );

      index++;
    }

    /*
     * ======================================================
     * 2. HISTORIAL REALIZADO
     * ======================================================
     *
     * Generamos visitas anteriores.
     *
     * Algunas son recientes.
     * Otras son de hace más de 21 días
     * para alimentar Recall Retoques.
     */

    console.log("Creando historial de clientas...");

    const historyData = [
      {
        daysAgo: 5,
        specialist: specialistDahiana,
        service: DEMO_SERVICES[0],
        start: "10:00",
      },

      {
        daysAgo: 7,
        specialist: specialistLucia,
        service: DEMO_SERVICES[4],
        start: "11:00",
      },

      {
        daysAgo: 9,
        specialist: specialistValentina,
        service: DEMO_SERVICES[2],
        start: "14:00",
      },

      {
        daysAgo: 12,
        specialist: specialistDahiana,
        service: DEMO_SERVICES[5],
        start: "15:00",
      },

      {
        daysAgo: 15,
        specialist: specialistLucia,
        service: DEMO_SERVICES[7],
        start: "16:00",
      },

      {
        daysAgo: 18,
        specialist: specialistValentina,
        service: DEMO_SERVICES[3],
        start: "09:30",
      },

      /*
       * Estas están fuera del período de 21 días
       * y deberían aparecer en Recall.
       */

      {
        daysAgo: 24,
        specialist: specialistDahiana,
        service: DEMO_SERVICES[0],
        start: "10:30",
      },

      {
        daysAgo: 26,
        specialist: specialistLucia,
        service: DEMO_SERVICES[4],
        start: "13:00",
      },

      {
        daysAgo: 28,
        specialist: specialistValentina,
        service: DEMO_SERVICES[2],
        start: "15:30",
      },

      {
        daysAgo: 31,
        specialist: specialistDahiana,
        service: DEMO_SERVICES[1],
        start: "09:00",
      },

      {
        daysAgo: 34,
        specialist: specialistLucia,
        service: DEMO_SERVICES[6],
        start: "11:30",
      },

      {
        daysAgo: 38,
        specialist: specialistValentina,
        service: DEMO_SERVICES[5],
        start: "17:00",
      },
    ];

    for (const item of historyData) {
      const date = addDays(today, -item.daysAgo);

      demoAppointments.push(
        createAppointment({
          index,
          customerIndex: index + 20,

          specialist: item.specialist,

          service: item.service,

          date,

          start: item.start,

          status: "done",
        }),
      );

      index++;
    }

    /*
     * ======================================================
     * 3. MÁS HISTORIAL
     * ======================================================
     *
     * Generamos más movimiento para que la métrica
     * "Atendidos" tenga un número interesante.
     */

    const historySpecialists = [
      specialistDahiana,
      specialistLucia,
      specialistValentina,
    ];

    for (let i = 0; i < 25; i++) {
      const specialist = historySpecialists[i % historySpecialists.length];

      const service = DEMO_SERVICES[(i + 2) % DEMO_SERVICES.length];

      const daysAgo = 2 + (i % 18);

      const date = addDays(today, -daysAgo);

      const hours = [
        "09:00",
        "10:00",
        "11:30",
        "13:00",
        "14:30",
        "16:00",
        "17:30",
        "19:00",
      ];

      const start = hours[i % hours.length];

      demoAppointments.push(
        createAppointment({
          index,
          customerIndex: index + 50,

          specialist,

          service,

          date,

          start,

          status: "done",
        }),
      );

      index++;
    }

    /*
     * ======================================================
     * 4. CITAS FUTURAS
     * ======================================================
     *
     * Sirve para que el CRM tenga actividad más allá
     * del día actual.
     */

    console.log("Creando próximas reservas...");

    const futureSpecialists = [
      specialistDahiana,
      specialistLucia,
      specialistValentina,
    ];

    for (let dayOffset = 1; dayOffset <= 7; dayOffset++) {
      const date = addDays(today, dayOffset);

      /*
       * Domingo libre
       */

      if (getDayIndex(date) === 6) {
        continue;
      }

      const starts = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];

      for (let i = 0; i < 4; i++) {
        const specialist =
          futureSpecialists[(i + dayOffset) % futureSpecialists.length];

        const service = DEMO_SERVICES[(i + dayOffset) % DEMO_SERVICES.length];

        demoAppointments.push(
          createAppointment({
            index,
            customerIndex: index + 100,

            specialist,

            service,

            date,

            start: starts[i],

            status: i % 2 === 0 ? "confirmed" : "pending",
          }),
        );

        index++;
      }
    }

    /*
     * ======================================================
     * GUARDAR FIREBASE
     * ======================================================
     */

    console.log("");

    console.log(`Total datos demo generados: ${demoAppointments.length}`);

    await centerRef.update({
      appointments: [...realAppointments, ...demoAppointments],
    });

    /*
     * ======================================================
     * RESUMEN
     * ======================================================
     */

    const todayString = formatDate(today);

    const appointmentsToday = demoAppointments.filter(
      (appointment) => appointment.date === todayString,
    );

    const pendingToday = appointmentsToday.filter(
      (appointment) => appointment.status === "pending",
    );

    const confirmedToday = appointmentsToday.filter(
      (appointment) => appointment.status === "confirmed",
    );

    const completed = demoAppointments.filter(
      (appointment) => appointment.status === "done",
    );

    const recallLimit = addDays(today, -21);

    const oldCompleted = demoAppointments.filter((appointment) => {
      if (appointment.status !== "done") {
        return false;
      }

      const date = new Date(`${appointment.date}T12:00:00`);

      return date < recallLimit;
    });

    console.log("");

    console.log("======================================");

    console.log("DASHBOARD DEMO CARGADO");

    console.log("======================================");

    console.log(`Citas de hoy: ${appointmentsToday.length}`);

    console.log(`Pendientes hoy: ${pendingToday.length}`);

    console.log(`Confirmadas hoy: ${confirmedToday.length}`);

    console.log(`Atendidos: ${completed.length}`);

    console.log(`Clientas para Recall: ${oldCompleted.length}`);

    console.log(
      `Próximas citas: ${
        demoAppointments.filter((appointment) => appointment.date > todayString)
          .length
      }`,
    );

    console.log(`Total demo: ${demoAppointments.length}`);

    console.log(`Citas reales conservadas: ${realAppointments.length}`);

    console.log(
      `Total agenda: ${realAppointments.length + demoAppointments.length}`,
    );

    console.log("======================================");

    console.log("Seed terminado correctamente.");

    console.log("======================================");
  } catch (error) {
    console.error("");

    console.error("======================================");

    console.error("ERROR EN SEED DASHBOARD");

    console.error("======================================");

    console.error(error);

    process.exitCode = 1;
  }
};

main();
