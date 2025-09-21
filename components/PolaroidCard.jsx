export default function PolaroidCard({ item }) {

  return (
    <div 
      className="group inline-block w-full mb-4 cursor-pointer [break-inside:avoid] transition-all duration-300 ease-out hover:!rotate-0 hover:scale-105 hover:z-50 transform -rotate-2"
    >
        <div 
          className="relative w-[110px] h-[180px] p-2 overflow-hidden mx-auto 
                     bg-white outline outline-2 outline-stone-300
                     shadow-lg transition-shadow duration-300 ease-out
                     group-hover:shadow-2xl flex flex-col"
                     >
          {/* Foto */}
          <div className="w-full aspect-[1/1] overflow-hidden bg-gray-100 border border-gray-200">
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-110"
            />
          </div>

          {/* Caption */}
          <div className="pt-2 text-center flex flex-col justify-center flex-grow overflow-hidden">
            <h2 className="font-semibold text-neutral-800 text-[14px] truncate font-sans">
              {item.name}
            </h2>
            <p className="font-sans text-neutral-600 text-[12px] leading-tight line-clamp-3">
              {item.message}
            </p>
          </div>
        </div>
    </div>
  )
}

