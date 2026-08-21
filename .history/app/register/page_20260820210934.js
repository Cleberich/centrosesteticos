// "use client";
// import React, { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// // IMPORTACIÓN DE EMAILJS
// import emailjs from "@emailjs/browser";

// // Iconos
// import {
//   Sparkles, // Cambiado de Scissors
//   Store,
//   Phone,
//   Mail,
//   Lock,
//   ArrowRight,
//   Loader2,
//   User,
//   ShieldCheck,
//   Heart, // Nuevo icono para estética
// } from "lucide-react";

// // Firebase
// import { auth, db } from "@/services/firebase";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { doc, setDoc, serverTimestamp, Timestamp } from "firebase/firestore";

// export default function RegisterPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     businessName: "",
//     ownerName: "",
//     email: "",
//     password: "",
//     phone: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // 1. Crear usuario en Auth
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         formData.email,
//         formData.password
//       );
//       const user = userCredential.user;

//       // Generadores de ID y fechas
//       const generateUID = () =>
//         Math.random().toString(36).substring(2, 15) +
//         Math.random().toString(36).substring(2, 15);

//       const specialistId = generateUID(); // Cambiado de barberId
//       const serviceId = generateUID();
//       const appointmentId = generateUID();

//       const today = new Date();
//       const dateString = today.toISOString().split("T")[0];
//       const dayIdx = today.getDay() === 0 ? 6 : today.getDay() - 1;

//       const expiryDate = new Date();
//       expiryDate.setMonth(expiryDate.getMonth() + 1);

//       const defaultAvatar =
//         "https://cdn-icons-png.flaticon.com/512/149/149071.png";

//       // 2. CREACIÓN DEL DOCUMENTO EN FIRESTORE
//       // Cambiado nombre de colección de 'barberias' a 'centros_estetica'
//       await setDoc(doc(db, "centros_estetica", user.uid), {
//         ownerId: user.uid,
//         businessName: formData.businessName,
//         email: formData.email,
//         phone: formData.phone || "",
//         createdAt: serverTimestamp(),
//         plan: {
//           type: "Inicial",
//           status: "active",
//           price: "0",
//           nextPayment: Timestamp.fromDate(expiryDate),
//           expiresAt: Timestamp.fromDate(expiryDate),
//           paymentStatus: "free",
//         },
//         specialists: [
//           // Cambiado de barbers
//           {
//             id: specialistId,
//             name: formData.ownerName,
//             imageUrl: defaultAvatar,
//             active: true,
//           },
//         ],
//         services: [
//           {
//             id: serviceId,
//             name: "Limpieza Facial Profunda", // Servicio de ejemplo de estética
//             price: "1200",
//             time: 60,
//             active: true,
//           },
//         ],
//         calendar: {
//           settings: { slotDuration: 30, startHour: "09:00", endHour: "20:00" },
//         },
//         appointments: [
//           {
//             id: appointmentId,
//             customer: "Cliente de Prueba",
//             phone: "092 123 456",
//             specialist: formData.ownerName, // Vinculado al nombre del dueño
//             service: "Limpieza Facial Profunda",
//             start: "10:00",
//             date: dateString,
//             day: dayIdx,
//             duration: 60,
//             status: "pending",
//             isTest: true,
//             note: "Esta es una cita de prueba automática",
//           },
//         ],
//         customers: [],
//       });

//       // 3. ENVIAR EMAIL DE NOTIFICACIÓN
//       try {
//         await emailjs.send(
//           "service_bm0xbov",
//           "template_vzfzz0m",
//           {
//             business_name: formData.businessName,
//             owner_name: formData.ownerName,
//             email: formData.email,
//             phone: formData.phone,
//           },
//           "QQV_D_IXpW03jTg8X"
//         );
//       } catch (emailError) {
//         console.error("Error enviando email:", emailError);
//       }

//       router.push("/dashboard");
//     } catch (error) {
//       console.error("Error en registro:", error);
//       alert("Error: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#FDF8FA] flex flex-col items-center justify-center p-6 dark:bg-[#0f0a0c]">
//       <div className="w-full max-w-[480px] space-y-8">
//         <div className="text-center space-y-3">
//           <div className="flex items-center justify-center gap-3">
//             <h1 className="text-2xl flex gap-2 font-black uppercase dark:text-white tracking-widest italic">
//               AppEstetica{" "}
//               <div className="size-10 -mt-2 bg-pink-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
//                 <Sparkles size={24} />
//               </div>
//               Estética
//             </h1>
//           </div>
//           <div>
//             <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">
//               Crea tu cuenta de profesional
//             </p>
//           </div>
//         </div>

//         <div className="bg-white dark:bg-[#1a1114] p-8 md:p-10 rounded-[3rem] shadow-2xl shadow-pink-100/50 dark:shadow-none border border-pink-50 dark:border-slate-800">
//           <form onSubmit={handleRegister} className="space-y-5">
//             <InputGroup
//               label="Nombre del Centro de Estética"
//               name="businessName"
//               placeholder="Ej. Centro Belleza"
//               icon={<Store size={18} />}
//               value={formData.businessName}
//               onChange={handleChange}
//               required
//             />

//             <InputGroup
//               label="Tu Nombre (Especialista Principal)"
//               name="ownerName"
//               placeholder="Ej. Valentina Gómez"
//               icon={<User size={18} />}
//               value={formData.ownerName}
//               onChange={handleChange}
//               required
//             />

//             <InputGroup
//               label="Correo Electrónico"
//               name="email"
//               type="email"
//               placeholder="contacto@tucentro.com"
//               icon={<Mail size={18} />}
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />

//             <InputGroup
//               label="Contraseña"
//               name="password"
//               type="password"
//               placeholder="Seguridad de nivel profesional"
//               icon={<Lock size={18} />}
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />

//             <InputGroup
//               label="Teléfono / WhatsApp"
//               name="phone"
//               placeholder="Ej. 099 123 456"
//               icon={<Phone size={18} />}
//               value={formData.phone}
//               onChange={handleChange}
//             />

//             <div className="pt-4">
//               <button
//                 disabled={loading}
//                 className="w-full bg-pink-500 hover:bg-pink-600 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-pink-500/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
//               >
//                 {loading ? (
//                   <Loader2 className="animate-spin" size={20} />
//                 ) : (
//                   <>
//                     Registrar mi Centro <ArrowRight size={18} />
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>

//           <div className="mt-8 flex items-center gap-3 p-4 bg-pink-50/50 dark:bg-pink-900/10 rounded-2xl border border-pink-100/50 dark:border-slate-800">
//             <Heart className="text-pink-500 shrink-0" size={20} />
//             <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 leading-tight uppercase tracking-tight">
//               Bienvenida: Hemos preparado una agenda con un tratamiento de
//               prueba para que explores las herramientas.
//             </p>
//           </div>
//         </div>

//         <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
//           ¿Ya eres parte de AppEstetica?{" "}
//           <Link href="/login" className="text-pink-500 hover:underline">
//             Inicia Sesión
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// function InputGroup({
//   label,
//   placeholder,
//   type = "text",
//   icon,
//   name,
//   value,
//   onChange,
//   required,
// }) {
//   return (
//     <div className="space-y-2">
//       <label className="text-[9px] font-black uppercase text-slate-400 tracking-[0.15em] ml-2">
//         {label}
//       </label>
//       <div className="relative group">
//         <div className="absolute inset-y-0 left-5 flex items-center text-slate-300 group-focus-within:text-pink-500 transition-colors pointer-events-none">
//           {icon}
//         </div>
//         <input
//           name={name}
//           value={value}
//           onChange={onChange}
//           type={type}
//           required={required}
//           placeholder={placeholder}
//           className="w-full py-4.5 pl-14 pr-5 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-pink-500/20 focus:bg-white dark:focus:bg-slate-800 rounded-[1.25rem] font-bold text-sm outline-none transition-all dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600"
//         />
//       </div>
//     </div>
//   );
// }
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import emailjs from "@emailjs/browser";

// Iconos
import {
  Store,
  Phone,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  Loader2,
  User,
  ShieldCheck,
  Sparkles,
  Check,
  Plus,
  Trash2,
  Clock3,
} from "lucide-react";

// Firebase
import { auth, db } from "@/services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp, Timestamp } from "firebase/firestore";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [specialists, setSpecialists] = useState([]);
  const [services, setServices] = useState([]);

  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    password: "",
    phone: "",
  });

  const categoryOptions = [
    "Manicura",
    "Pestañas",
    "Peluquería",
    "Masajes",
    "Estética facial",
    "Estética corporal",
    "Depilación",
    "Maquillaje",
  ];

  const generateUID = () => Math.random().toString(36).substring(2, 15);

  const addSpecialist = () =>
    setSpecialists((current) => [
      ...current,
      { id: generateUID(), name: "", specialty: "", active: true },
    ]);

  const addService = () =>
    setServices((current) => [
      ...current,
      {
        id: generateUID(),
        name: "",
        category: categories[0] || "Estética facial",
        price: "",
        time: 60,
        active: true,
        specialistPrices: {},
        specialistTimes: {},
      },
    ]);

  const updateSpecialist = (id, field, value) => {
    setSpecialists((current) =>
      current.map((specialist) =>
        specialist.id === id ? { ...specialist, [field]: value } : specialist,
      ),
    );
  };

  const updateService = (id, field, value) => {
    setServices((current) =>
      current.map((service) =>
        service.id === id ? { ...service, [field]: value } : service,
      ),
    );
  };

  const updateServiceSpecialistValue = (serviceId, specialistId, field, value) => {
    setServices((current) =>
      current.map((service) =>
        service.id === serviceId
          ? {
              ...service,
              [field]: {
                ...service[field],
                [specialistId]: value,
              },
            }
          : service,
      ),
    );
  };

  const canContinue = () => {
    if (step === 1) {
      return (
        formData.businessName.trim() &&
        formData.ownerName.trim() &&
        formData.email.trim() &&
        formData.password.length >= 6
      );
    }
    if (step === 2) return categories.length > 0;
    if (step === 3) return specialists.length > 0 && specialists.every((item) => item.name.trim());
    if (step === 4) {
      return (
        services.length > 0 &&
        services.every(
          (service) =>
            service.name.trim() &&
            Number(service.price) > 0 &&
            Number(service.time) > 0 &&
            specialists.every(
              (specialist) =>
                Number(service.specialistPrices?.[specialist.id]) > 0 &&
                Number(service.specialistTimes?.[specialist.id]) > 0,
            ),
        )
      );
    }
    return true;
  };

  const handleNextStep = () => {
    if (!canContinue()) return;
    if (step === 2 && specialists.length === 0) {
      setSpecialists([
        { id: generateUID(), name: formData.ownerName, specialty: "", active: true },
      ]);
    }
    if (step === 3 && services.length === 0) {
      setServices([
        {
          id: generateUID(),
          name: "",
          category: categories[0] || "Estética facial",
          price: "",
          time: 60,
          active: true,
          specialistPrices: {},
          specialistTimes: {},
        },
      ]);
    }
    setStep((current) => current + 1);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Crear usuario en Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );
      const user = userCredential.user;

      const configuredSpecialists = specialists.map((specialist) => ({
        ...specialist,
        name: specialist.name.trim(),
        specialty: specialist.specialty.trim(),
      }));
      const configuredServices = services.map((service) => ({
        ...service,
        name: service.name.trim(),
        category: service.category || categories[0],
        price: String(service.price),
        time: Number(service.time),
        specialistPrices: Object.fromEntries(
          configuredSpecialists.map((specialist) => [
            specialist.id,
            String(service.specialistPrices[specialist.id]),
          ]),
        ),
        specialistTimes: Object.fromEntries(
          configuredSpecialists.map((specialist) => [
            specialist.id,
            Number(service.specialistTimes[specialist.id]),
          ]),
        ),
      }));

      const today = new Date();
      const dateString = today.toISOString().split("T")[0];
      const dayIdx = today.getDay() === 0 ? 6 : today.getDay() - 1;

      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 1);

      const defaultAvatar =
        "https://cdn-icons-png.flaticon.com/512/149/149071.png";

      // 2. CREACIÓN DEL DOCUMENTO EN FIRESTORE
      await setDoc(doc(db, "centros_estetica", user.uid), {
        ownerId: user.uid,
        businessName: formData.businessName,
        email: formData.email,
        phone: formData.phone || "",
        createdAt: serverTimestamp(),
        plan: {
          type: "Inicial",
          status: "active",
          price: "0",
          nextPayment: Timestamp.fromDate(expiryDate),
          expiresAt: Timestamp.fromDate(expiryDate),
          paymentStatus: "free",
        },
        categories,
        onboardingCompleted: true,
        specialists: configuredSpecialists.map((specialist) => ({
          ...specialist,
          imageUrl: specialist.imageUrl || defaultAvatar,
        })),
        services: configuredServices,
        calendar: {
          settings: { slotDuration: 30, startHour: "09:00", endHour: "20:00" },
        },
        appointments: [],
        customers: [],
      });

      // 3. ENVIAR EMAIL DE NOTIFICACIÓN
      try {
        await emailjs.send(
          "service_bm0xbov",
          "template_vzfzz0m",
          {
            business_name: formData.businessName,
            owner_name: formData.ownerName,
            email: formData.email,
            phone: formData.phone,
          },
          "QQV_D_IXpW03jTg8X",
        );
      } catch (emailError) {
        console.error("Error enviando email:", emailError);
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Error en registro:", error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] text-[#334155] font-sans antialiased p-4 py-8">
      <div className="max-w-md w-full space-y-6">
        {/* LOGO EXACTO AL CRM */}

        {/* TARJETA PRINCIPAL DE REGISTRO */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl shadow-purple-100/40 space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Crea tu cuenta profesional
            </h2>
            <p className="text-xs text-slate-400">
              Prueba gratis todas las funcionalidades de gestión
            </p>
          </div>

          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <span>Paso {step} de 5</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className={`h-1.5 w-7 rounded-full ${item <= step ? "bg-emerald-400" : "bg-slate-100"}`} />
              ))}
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {step === 1 && <div className="space-y-3.5">
            <InputGroup
              label="Nombre del Centro de Estética"
              name="businessName"
              placeholder="Ej. Centro Belleza"
              icon={<Store size={16} />}
              value={formData.businessName}
              onChange={handleChange}
              required
            />

            <InputGroup
              label="Tu Nombre (Especialista Principal)"
              name="ownerName"
              placeholder="Ej. Valentina Gómez"
              icon={<User size={16} />}
              value={formData.ownerName}
              onChange={handleChange}
              required
            />

            <InputGroup
              label="Correo Electrónico"
              name="email"
              type="email"
              placeholder="contacto@tucentro.com"
              icon={<Mail size={16} />}
              value={formData.email}
              onChange={handleChange}
              required
            />

            <InputGroup
              label="Contraseña"
              name="password"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={16} />}
              value={formData.password}
              onChange={handleChange}
              required
            />

            <InputGroup
              label="Teléfono / WhatsApp"
              name="phone"
              placeholder="Ej. 099 123 456"
              icon={<Phone size={16} />}
              value={formData.phone}
              onChange={handleChange}
            />
            </div>}

            {step === 2 && <div className="space-y-5">
              <div><h3 className="text-lg font-bold text-slate-800">¿Qué servicios ofreces?</h3><p className="text-xs text-slate-400 mt-1">Selecciona una o varias categorías.</p></div>
              <div className="grid grid-cols-2 gap-2">
                {categoryOptions.map((category) => {
                  const selected = categories.includes(category);
                  return <button type="button" key={category} onClick={() => setCategories((current) => selected ? current.filter((item) => item !== category) : [...current, category])} className={`flex items-center justify-between rounded-2xl border p-3 text-left text-xs font-semibold ${selected ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600"}`}>{category}{selected && <Check size={15} />}</button>;
                })}
              </div>
            </div>}

            {step === 3 && <div className="space-y-5">
              <div><h3 className="text-lg font-bold text-slate-800">¿Quiénes atienden?</h3><p className="text-xs text-slate-400 mt-1">Agrega tu equipo. Tú ya eres la primera especialista.</p></div>
              <div className="space-y-3">
                {specialists.map((specialist, index) => <div key={specialist.id} className="flex gap-2 items-end"><div className="flex-1 grid grid-cols-2 gap-2"><input value={specialist.name} onChange={(event) => updateSpecialist(specialist.id, "name", event.target.value)} placeholder={index === 0 ? formData.ownerName : "Nombre"} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs outline-none focus:border-emerald-400" /><input value={specialist.specialty} onChange={(event) => updateSpecialist(specialist.id, "specialty", event.target.value)} placeholder="Especialidad (opcional)" className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs outline-none focus:border-emerald-400" /></div>{specialists.length > 1 && <button type="button" onClick={() => setSpecialists((current) => current.filter((item) => item.id !== specialist.id))} className="p-3 text-rose-400" aria-label="Eliminar especialista"><Trash2 size={16} /></button>}</div>)}
              </div>
              <button type="button" onClick={addSpecialist} className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600"><Plus size={16} /> Agregar especialista</button>
            </div>}

            {step === 4 && <div className="space-y-5">
              <div><h3 className="text-lg font-bold text-slate-800">Configura tus servicios</h3><p className="text-xs text-slate-400 mt-1">Cada especialista puede tener su propio precio y duración.</p></div>
              <div className="space-y-4">
                {services.map((service) => <div key={service.id} className="rounded-2xl border border-slate-200 p-4 space-y-3"><div className="flex gap-2"><input value={service.name} onChange={(event) => updateService(service.id, "name", event.target.value)} placeholder="Ej. Manicura semipermanente" className="flex-1 rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-emerald-400" /><button type="button" onClick={() => setServices((current) => current.filter((item) => item.id !== service.id))} className="p-2 text-rose-400" aria-label="Eliminar servicio"><Trash2 size={16} /></button></div><select value={service.category} onChange={(event) => updateService(service.id, "category", event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs outline-none">{(categories.length ? categories : categoryOptions).map((category) => <option key={category}>{category}</option>)}</select>{specialists.map((specialist) => <div key={specialist.id} className="grid grid-cols-[1fr_90px_90px] items-center gap-2"><span className="truncate text-xs font-semibold text-slate-600">{specialist.name || "Especialista"}</span><input type="number" min="1" value={service.specialistPrices?.[specialist.id] || ""} onChange={(event) => updateServiceSpecialistValue(service.id, specialist.id, "specialistPrices", event.target.value)} placeholder="$ Precio" className="rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-emerald-400" /><div className="relative"><Clock3 size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" /><input type="number" min="1" value={service.specialistTimes?.[specialist.id] || ""} onChange={(event) => updateServiceSpecialistValue(service.id, specialist.id, "specialistTimes", event.target.value)} placeholder="Min" className="w-full rounded-xl border border-slate-200 p-2.5 pl-7 text-xs outline-none focus:border-emerald-400" /></div></div>)}</div>)}
              </div>
              <button type="button" onClick={addService} className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600"><Plus size={16} /> Agregar servicio</button>
            </div>}

            {step === 5 && <div className="space-y-4"><div><h3 className="text-lg font-bold text-slate-800">Todo listo para comenzar</h3><p className="text-xs text-slate-400 mt-1">Revisa tu configuración antes de crear la cuenta.</p></div><div className="rounded-2xl bg-slate-50 p-4 text-xs text-slate-600 space-y-2"><p><strong>Centro:</strong> {formData.businessName}</p><p><strong>Categorías:</strong> {categories.join(", ")}</p><p><strong>Especialistas:</strong> {specialists.map((item) => item.name).join(", ")}</p><p><strong>Servicios:</strong> {services.map((item) => item.name).join(", ")}</p></div></div>}

            <div className="flex gap-2 pt-2">
              {step > 1 && <button type="button" onClick={() => setStep((current) => current - 1)} className="flex-1 rounded-2xl border border-slate-200 py-3.5 text-xs font-bold text-slate-500"><ArrowLeft size={15} className="inline mr-1" /> Atrás</button>}
              <button
                disabled={loading}
                type={step === 5 ? "submit" : "button"}
                onClick={() => step < 5 && handleNextStep()}
                className="flex-[2] py-3.5 bg-[#6ee7b7] hover:bg-[#5eead4] text-slate-800 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="animate-spin text-slate-800" size={18} />
                ) : (
                  <>
                    <span>{step === 5 ? "Crear mi cuenta" : "Continuar"}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* WIDGET PASTELES DE BIENVENIDA */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-100/60 via-pink-100/60 to-amber-100/40 border border-purple-100/70 flex items-center justify-between text-left">
            <div className="pr-2">
              <p className="text-[11px] font-bold text-slate-800 leading-tight">
                Inicia con datos de prueba
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                Preparamos una agenda y un tratamiento inicial para explorar.
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#c084fc] to-[#e879f9] flex items-center justify-center text-white shrink-0 shadow-xs">
              <Sparkles size={15} />
            </div>
          </div>

          <p className="text-center text-xs font-medium text-slate-400 pt-1">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="text-[#a855f7] font-bold hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-slate-400">
          <ShieldCheck size={14} className="text-[#6ee7b7]" />
          <span>Configuración lista en 5 minutos</span>
        </div>
      </div>
    </div>
  );
}

// COMPONENTE HELPER REUTILIZABLE CON ESTILO CRM
function InputGroup({
  label,
  placeholder,
  type = "text",
  icon,
  name,
  value,
  onChange,
  required,
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-600 ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#a855f7] transition-colors pointer-events-none">
          {icon}
        </div>
        <input
          name={name}
          value={value}
          onChange={onChange}
          type={type}
          required={required}
          placeholder={placeholder}
          className="w-full pl-11 pr-4 py-3 bg-[#f8fafc] border border-slate-200/80 rounded-2xl text-xs font-medium text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#c084fc]/30 focus:border-[#c084fc] transition-all placeholder:text-slate-400"
        />
      </div>
    </div>
  );
}
