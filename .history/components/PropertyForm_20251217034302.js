// "use client";

// import { addDoc, collection, serverTimestamp } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { auth, db, storage } from "@/services/firebase";
// import { useRouter } from "next/navigation";
// import { useState, useRef } from "react";
// import Compressor from "browser-image-compression";

// const barriosMontevideo = [
//   "Pocitos",
//   "Carrasco",
//   "Centro",
//   "Ciudad Vieja",
//   "Buceo",
//   "Malvín",
//   "Punta Carretas",
//   "Prado",
//   "Parque Rodó",
//   "Cordón",
//   "La Blanqueada",
//   "Tres Cruces",
//   "Parque Batlle",
// ];

// export default function PropertyForm() {
//   const [formData, setFormData] = useState({
//     titulo: "",
//     precio: "",
//     dormitorios: "",
//     barrio: "",
//     direccion: "",
//     lat: "",
//     lng: "",
//   });
//   const [imagenes, setImagenes] = useState([]);
//   const [previewUrls, setPreviewUrls] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const fileInputRef = useRef(null);
//   const router = useRouter();

//   const handleGeolocate = () => {
//     if (!navigator.geolocation) return alert("Geolocalización no soportada");
//     navigator.geolocation.getCurrentPosition(
//       (pos) =>
//         setFormData((prev) => ({
//           ...prev,
//           lat: pos.coords.latitude.toString(),
//           lng: pos.coords.longitude.toString(),
//         })),
//       () => alert("No se pudo obtener tu ubicación")
//     );
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length + imagenes.length > 5) return alert("Máximo 5 fotos");
//     setImagenes((prev) => [...prev, ...files]);
//     setPreviewUrls((prev) => [
//       ...prev,
//       ...files.map((file) => URL.createObjectURL(file)),
//     ]);
//   };

//   const removeImage = (index) => {
//     setImagenes((prev) => prev.filter((_, i) => i !== index));
//     setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (imagenes.length === 0 || !formData.lat)
//       return alert("Faltan fotos o ubicación");
//     setLoading(true);
//     try {
//       const user = auth.currentUser;
//       const urls = [];
//       for (const file of imagenes) {
//         const compressed = await Compressor(file, {
//           quality: 0.6,
//           maxWidth: 1024,
//         });
//         const sRef = ref(
//           storage,
//           `propiedades/${user.uid}/${Date.now()}_${file.name}`
//         );
//         await uploadBytes(sRef, compressed);
//         urls.push(await getDownloadURL(sRef));
//       }
//       await addDoc(collection(db, "propiedades"), {
//         ...formData,
//         precio: Number(formData.precio),
//         lat: parseFloat(formData.lat),
//         lng: parseFloat(formData.lng),
//         fotos: urls,
//         agenteId: user.uid,
//         createdAt: serverTimestamp(),
//         activa: true,
//       });
//       router.push("/mapa");
//     } catch (err) {
//       alert("Error al guardar");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="space-y-8 animate-in fade-in duration-500"
//     >
//       {/* Sección 1: Detalles Básicos */}
//       <section className="space-y-4">
//         <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">
//           Información General
//         </h3>
//         <InputField
//           label="Título del anuncio"
//           name="titulo"
//           placeholder="Ej: Penthouse con vista al mar"
//           value={formData.titulo}
//           onChange={handleChange}
//         />

//         <div className="grid grid-cols-2 gap-4">
//           <InputField
//             label="Precio (USD)"
//             name="precio"
//             type="number"
//             placeholder="0.00"
//             value={formData.precio}
//             onChange={handleChange}
//           />
//           <SelectField
//             label="Dormitorios"
//             name="dormitorios"
//             value={formData.dormitorios}
//             onChange={handleChange}
//             options={[1, 2, 3, 4, 5]}
//           />
//         </div>
//       </section>

//       {/* Sección 2: Ubicación */}
//       <section className="space-y-4">
//         <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">
//           Ubicación
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <SelectField
//             label="Barrio"
//             name="barrio"
//             value={formData.barrio}
//             onChange={handleChange}
//             options={barriosMontevideo}
//             isString
//           />
//           <InputField
//             label="Dirección"
//             name="direccion"
//             placeholder="Calle y número"
//             value={formData.direccion}
//             onChange={handleChange}
//           />
//         </div>

//         <button
//           type="button"
//           onClick={handleGeolocate}
//           className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg border-2 transition-all ${
//             formData.lat
//               ? "border-green-500 bg-green-50 text-green-700"
//               : "border-black bg-white text-black hover:bg-gray-50"
//           }`}
//         >
//           <svg
//             width="20"
//             height="20"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             viewBox="0 0 24 24"
//           >
//             <path d="M12 21s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 7.2c0 7.3-8 11.8-8 11.8z" />
//             <circle cx="12" cy="9" r="3" />
//           </svg>
//           {formData.lat ? "Ubicación establecida" : "Marcar ubicación actual"}
//         </button>
//       </section>

//       {/* Sección 3: Multimedia */}
//       <section className="space-y-4">
//         <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">
//           Fotos de la propiedad
//         </h3>
//         <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
//           {previewUrls.map((url, i) => (
//             <div key={i} className="relative aspect-square group">
//               <img
//                 src={url}
//                 className="h-full w-full object-cover rounded-xl border border-gray-100"
//               />
//               <button
//                 type="button"
//                 onClick={() => removeImage(i)}
//                 className="absolute -top-2 -right-2 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"
//               >
//                 ×
//               </button>
//             </div>
//           ))}
//           {imagenes.length < 5 && (
//             <button
//               type="button"
//               onClick={() => fileInputRef.current?.click()}
//               className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl hover:border-black hover:bg-gray-50 transition-all text-gray-400 hover:text-black"
//             >
//               <span className="text-2xl">+</span>
//               <span className="text-[10px] font-medium uppercase">Subir</span>
//             </button>
//           )}
//         </div>
//         <input
//           type="file"
//           ref={fileInputRef}
//           onChange={handleImageChange}
//           accept="image/*"
//           multiple
//           className="hidden"
//         />
//       </section>

//       {/* Botón Final */}
//       <div className="pt-6">
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-black py-4 text-white font-medium text-lg rounded-xl hover:bg-gray-800 transition-all disabled:bg-gray-200 flex items-center justify-center gap-3"
//         >
//           {loading ? (
//             <>
//               <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//               Publicando...
//             </>
//           ) : (
//             "Confirmar y Publicar"
//           )}
//         </button>
//       </div>
//     </form>
//   );
// }

// // Helpers para mantener el estilo Uber
// function InputField({ label, ...props }) {
//   return (
//     <div className="flex flex-col gap-1 w-full">
//       <label className="text-xs font-bold text-gray-700 ml-1">{label}</label>
//       <input
//         {...props}
//         className="w-full bg-[#f6f6f6] border-none px-4 py-3 rounded-lg text-black focus:ring-2 focus:ring-black transition-all"
//       />
//     </div>
//   );
// }

// function SelectField({ label, options, isString, ...props }) {
//   return (
//     <div className="flex flex-col gap-1 w-full">
//       <label className="text-xs font-bold text-gray-700 ml-1">{label}</label>
//       <select
//         {...props}
//         className="w-full bg-[#f6f6f6] border-none px-4 py-3 rounded-lg text-black focus:ring-2 focus:ring-black transition-all appearance-none"
//       >
//         <option value="">Seleccionar</option>
//         {options.map((o) => (
//           <option key={o} value={o}>
//             {isString ? o : `${o} dorms`}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }
"use client";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "@/services/firebase";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import Compressor from "browser-image-compression";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";

const barriosMontevideo = [
  "Pocitos",
  "Carrasco",
  "Centro",
  "Ciudad Vieja",
  "Buceo",
  "Malvín",
  "Punta Carretas",
  "Prado",
  "Parque Rodó",
  "Cordón",
  "La Blanqueada",
  "Tres Cruces",
  "Parque Batlle",
];

const libraries = ["places"];

export default function PropertyForm() {
  const [formData, setFormData] = useState({
    titulo: "",
    precio: "",
    dormitorios: "",
    barrio: "",
    direccion: "",
    lat: "",
    lng: "",
  });

  const [imagenes, setImagenes] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const router = useRouter();

  // Cargando Google Maps con tu clave de la imagen
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyD8KgUn-IqYYSgnllCyOgDcIPVDdEkel6I",
    libraries: libraries,
  });

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();

      if (!place.geometry) {
        alert("Por favor, selecciona una dirección sugerida en la lista.");
        return;
      }

      // Extrae coordenadas y dirección formateada
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const address = place.formatted_address || place.name;

      setFormData((prev) => ({
        ...prev,
        direccion: address,
        lat: lat.toString(),
        lng: lng.toString(),
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imagenes.length > 5) return alert("Máximo 5 fotos");
    setImagenes((prev) => [...prev, ...files]);
    setPreviewUrls((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const removeImage = (index) => {
    setImagenes((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imagenes.length === 0 || !formData.lat) {
      return alert(
        "Debes seleccionar una dirección válida y subir al menos una foto."
      );
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      const urls = [];
      for (const file of imagenes) {
        const compressed = await Compressor(file, {
          quality: 0.6,
          maxWidth: 1024,
        });
        const sRef = ref(
          storage,
          `propiedades/${user.uid}/${Date.now()}_${file.name}`
        );
        await uploadBytes(sRef, compressed);
        urls.push(await getDownloadURL(sRef));
      }

      await addDoc(collection(db, "propiedades"), {
        ...formData,
        precio: Number(formData.precio),
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
        fotos: urls,
        agenteId: user.uid,
        createdAt: serverTimestamp(),
        activa: true,
      });

      router.push("/mapa");
    } catch (err) {
      alert("Error al guardar la propiedad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      <form
        onSubmit={handleSubmit}
        className="space-y-8 animate-in fade-in duration-500"
      >
        {/* Información General */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">
            Información General
          </h3>
          <InputField
            label="Título"
            name="titulo"
            placeholder="Ej: Apartamento en Pocitos"
            value={formData.titulo}
            onChange={handleChange}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Precio (USD)"
              name="precio"
              type="number"
              value={formData.precio}
              onChange={handleChange}
              required
            />
            <SelectField
              label="Dorms"
              name="dormitorios"
              value={formData.dormitorios}
              onChange={handleChange}
              options={[1, 2, 3, 4, 5]}
              required
            />
          </div>
        </section>

        {/* Ubicación con Autocomplete */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">
            Ubicación
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Barrio"
              name="barrio"
              value={formData.barrio}
              onChange={handleChange}
              options={barriosMontevideo}
              isString
              required
            />

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-700 ml-1">
                Dirección Exacta
              </label>
              {isLoaded ? (
                <Autocomplete
                  onLoad={(ref) => (autocompleteRef.current = ref)}
                  onPlaceChanged={onPlaceChanged}
                  options={{ componentRestrictions: { country: "uy" } }}
                >
                  <input
                    type="text"
                    placeholder="Calle y número..."
                    className="w-full bg-[#f6f6f6] border-none px-4 py-3 rounded-lg text-black focus:ring-2 focus:ring-black"
                    value={formData.direccion}
                    onChange={(e) =>
                      setFormData({ ...formData, direccion: e.target.value })
                    }
                    required
                  />
                </Autocomplete>
              ) : (
                <div className="w-full h-11 bg-gray-100 animate-pulse rounded-lg" />
              )}
            </div>
          </div>
          {formData.lat && (
            <div className="text-[11px] text-green-600 font-bold bg-green-50 p-2 rounded-lg flex items-center gap-2">
              ✓ Ubicación georeferenciada (Lat:{" "}
              {parseFloat(formData.lat).toFixed(4)})
            </div>
          )}
        </section>

        {/* Multimedia */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">
            Fotos (Máx 5)
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {previewUrls.map((url, i) => (
              <div key={i} className="relative aspect-square">
                <img
                  src={url}
                  className="h-full w-full object-cover rounded-xl border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-1 -right-1 bg-black text-white rounded-full w-5 h-5 text-xs"
                >
                  ×
                </button>
              </div>
            ))}
            {imagenes.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl hover:bg-gray-50 text-gray-400"
              >
                <span className="text-xl">+</span>
              </button>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            multiple
            className="hidden"
          />
        </section>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black py-4 text-white font-bold rounded-xl hover:bg-zinc-800 disabled:bg-gray-300 transition-colors"
        >
          {loading ? "Publicando..." : "Confirmar y Publicar"}
        </button>
      </form>
    </div>
  );
}

function InputField({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs font-bold text-gray-700 ml-1">{label}</label>
      <input
        {...props}
        className="w-full bg-[#f6f6f6] border-none px-4 py-3 rounded-lg text-black focus:ring-2 focus:ring-black outline-none"
      />
    </div>
  );
}

function SelectField({ label, options, isString, ...props }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs font-bold text-gray-700 ml-1">{label}</label>
      <select
        {...props}
        className="w-full bg-[#f6f6f6] border-none px-4 py-3 rounded-lg text-black focus:ring-2 focus:ring-black outline-none appearance-none"
      >
        <option value="">Seleccionar</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {isString ? o : `${o} dorms`}
          </option>
        ))}
      </select>
    </div>
  );
}
