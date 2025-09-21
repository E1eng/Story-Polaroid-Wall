import { useEffect, useState } from 'react'
import PolaroidCard from '../components/PolaroidCard'
import { supabase } from '../lib/supabaseClient'
import toast, { Toaster } from 'react-hot-toast'

export default function Home() {
  const [polaroids, setPolaroids] = useState([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('No file chosen')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPolaroids()
    const subscription = supabase
      .channel('public:polaroids')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'polaroids' },
        () => fetchPolaroids()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [])

  async function fetchPolaroids() {
    setLoading(true)
    const { data, error } = await supabase
      .from('polaroids')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setPolaroids(data)
    setLoading(false)
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!file) return toast.error('Select the file first!')
    setLoading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase
        .storage.from('images')
        .upload(fileName, file, { upsert: false })

      if (uploadError) throw uploadError

      const { data: publicURLData } = supabase
        .storage
        .from('images')
        .getPublicUrl(fileName)

      const imageUrl = publicURLData.publicUrl

      const { error: insertError } = await supabase
        .from('polaroids')
        .insert([{ name, message, image_url: imageUrl }])
        .select()

      if (insertError) throw insertError

      setName('')
      setMessage('')
      setFile(null)
      setFileName('No file chosen')
      toast.success('successfully uploaded!')
    } catch (err) {
      console.error(err)
      toast.error('upload failed!: ' + err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
    <Head>
        <title>Community Polaroid Wall</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster position="top-center" reverseOrder={false} toastOptions={{
        style: { background: '#333', color: 'white' },
      }}/>
      
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50 -z-10" />

      <div className="relative z-10 min-h-screen p-4 sm:p-6 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between">
          <img src="/symbol.svg" alt="Logo" className="w-10 h-10 sm:w-12 sm:h-12" />
          <h1 className="flex-1 text-center text-3xl sm:text-4xl font-extrabold font-lobster text-white">
            Community Polaroid Wall
          </h1>
          <div className="w-10 sm:w-12" />
        </header>

        {/* Form Upload */}
        <div className="flex justify-center my-4 sm:my-8">
          <form
            className="flex flex-wrap gap-3 items-center justify-center max-w-3xl w-full p-3 sm:p-4 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm"
            onSubmit={handleCreate}
          >
            <input
              className="p-2 rounded flex-grow text-sm bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="p-2 rounded flex-grow text-sm bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-amber-500 focus:border-amber-500"
              placeholder="One line about you"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            
            {/* Custom File Input */}
            <div className="flex items-center">
              <label className="cursor-pointer px-4 py-2 bg-gray-600 hover:bg-gray-500 transition rounded-l-lg text-white font-medium text-sm">
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              <span className="p-2 bg-white/10 border-y border-r border-white/20 text-white text-xs rounded-r-lg truncate max-w-[120px]">
                {fileName}
              </span>
            </div>

            <button
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 transition rounded-lg text-black font-bold text-sm flex items-center justify-center w-36"
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Create Polaroid'}
            </button>
          </form>
        </div>

        {/* Grid Polaroids */}
        <div className="flex-grow">
          {polaroids.length > 0 ? (
            <div
              className="grid gap-2 sm:gap-3 items-stretch"
              style={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))',
              }}
            >
              {polaroids.map((p) => (
                <PolaroidCard key={p.id} item={p} />
              ))}
            </div>
          ) : (
            !loading && (
              <div className="text-center text-gray-300 mt-20">
                <p className="text-xl">There are no photos on the wall yet.</p>
                <p>Be the first to upload!</p>
              </div>
            )
          )}
        </div>
        {/* Footer */}
        <footer className="text-center text-white/50 text-sm mt-auto pt-8">
          <p>Developed by eLeng</p>
        </footer>
      </div>
    </div>
  )
}

