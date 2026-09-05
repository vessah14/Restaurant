export default function Carte({name,description,image,price}) {
  return (
    <>
      <div className="w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-lg ">
        <div className="relative overflow-hidden">
            <img
          className="object-cover object-center w-full h-56 duration-700 ease-in-out hover:scale-105"
          src={image}
          loading = 'lazy'
          alt={name}
        />
        <span style={{ backgroundColor: "#C4A060" }} className="absolute top-3 right-3 bg-white/90  text-gray-900  text-sm font-semibold px-3 py-1 rounded-full shadow-md">
      {price} €
    </span>
        </div>
        

        <div className="px-6 py-4">
          <h1 className="break-words text-xl font-['Playfair_Display'] font-black text-gray-800">
            {name}
          </h1>

          <p className="break-words py-2 text-gray-400">
            {description}
          </p>
        </div>
      </div>
    </>
  );
}
