import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'

export default function App() {
  const [opened, setOpened] = useState(false)
  const [music_on, setMusicOn] = useState(true)
  const [timeleft, setTimeLeft] = useState({})
  const [guest_name, setGuestName] = useState("")
  const [guest_email, setGuestEmail] = useState("")
  const [guests, setGuests] = useState([])
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [show_doors, setShowDoors] = useState(true)
  const [fullscreen, setFullScreen] = useState(null)
  const audio_ref = useRef(null)
  const door_sound = useRef(null)
  const canvas_ref = useRef(null)
  const [current, setCurrent] = useState(0)
  const [attendance, setAttendance] = useState("Приду")

  const images = [
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486",
    "https://images.unsplash.com/photo-1618566864264-fb013f791da4",
    "https://images.unsplash.com/photo-1612883833766-7930d960e16f",
    "https://plus.unsplash.com/premium_photo-1706485734742-4a4153f34d2f",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
  ]

  const weeding_date = new Date("2026-06-16")

  useEffect(() => {
    setTimeout(() => setLoading(false), 3000)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const difference = weeding_date - now

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (music_on) audio_ref.current?.play()
    else audio_ref.current?.pause()
  }, [music_on])

  useEffect(() => {
    if (fullscreen) return
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [fullscreen])

  useEffect(() => {
    if (!opened) return

    const canvas = canvas_ref.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = canvas.width = window.innerWidth
    let height = canvas.height = window.innerHeight

    const petals = Array.from({ length: 60 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 6 + 2,
      d: Math.random() * 1,
      angle: Math.random() * 360
    }))

    function draw() {
      ctx.clearRect(0, 0, width, height)

      petals.forEach(p => {
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle)

        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.bezierCurveTo(5, -5, 10, 5, 0, 10)
        ctx.bezierCurveTo(-10, 5, -5, -5, 0, 0)

        ctx.fillStyle = "rgba(255,182,193, 0.9)"
        ctx.fill()

        ctx.restore()

        p.y += p.d + 1.2
        p.x += Math.sin(p.y * 0.02)
        p.angle += 0.01

        if (p.y > height) {
          p.y = -10
          p.x = Math.random() * width
        }
      })
      requestAnimationFrame(draw)
    }
    draw()
    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [opened])

  const handleOpen = () => {
    setOpened(true)

    door_sound.current?.play()
    
    setTimeout(() => {
      setShowDoors(false)
    }, 1500)

    setTimeout(() => {
      audio_ref.current?.play()

    }, 1200)
  }

  const handleRSVP = async (e) => {
    e.preventDefault();

    const TOKEN = import.meta.env.VITE_TG_TOKEN
    const CHAT_ID = import.meta.env.VITE_CHAT_ID
    const text = `
    💍 Новый гость!
    👤 Имя: ${guest_name}
    📧 Email: ${guest_email}
    📝 Ответ: ${attendance}
    `;

    try {
      await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: text,
        })
      })

      setGuests([...guests, {
        name: guest_name,
        email: guest_email,
        attendance: attendance
      }])

      setGuestName("")
      setGuestEmail("")
      setAttendance("Приду")

      setSuccess(true)

    } catch (error) {
      alert("Ошибка отправки 😢");
    }
  };

  return (
    <div className="bg-black text-white overflow-hidden font-serif">
      {loading && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
          <div className="text-white text-2xl animate-pulse">
            Loading wedding...
          </div>
        </div>
      )}

      <audio ref={door_sound} src='/door.mp3'></audio>
      <audio ref={audio_ref} loop>
        <source src="/music.mp3" type="audio/mpeg" />
      </audio>

      {opened && <canvas ref={canvas_ref} className='fixed top-0 left-0 w-full h-full pointer-events-none z-0' />}

      {!opened && (
        <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-400 to-purple-700 text-center text-white">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className='text-5xl mb-6'
          >
            Приглашение на свадьбу
          </motion.h1>
          <motion.button
            onClick={handleOpen}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className='w-full max-w-xs mx-auto text-2xl md:text-3xl border animate-pulse border-white px-8 py-3 rounded-full hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] hover:bg-white hover:text-pink-500 active:scale-90 transition-all duration-300 ease-in-out cursor-pointer'
          >
            Открыть
          </motion.button>
        </div>
      )}

      {opened && (
        <>
        {show_doors && (
          <div className='fixed inset-0 z-[999] flex'>

            <div className='absolute inset-0 flex items-center justify-center'>
              <motion.div initial={{ opacity: 0 }}
              animate={{ opacity: 1 }} 
              transition={{ duration: 2 }}
              className='w-full h-full bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400 blur-3xl opacity-70'/>
            </div>

            <motion.div initial={{ x: 0 }}
             animate={{ x: "-100%" }}
             transition={{ duration: 1.5, ease: "easeInOut" }}
             className='w-1/2 h-full bg-gradient-to-r from-black to-gray-800'
             />

             <motion.div initial={{ x: 0 }}
             animate={{ x: "100%" }}
             transition={{ duration: 1.5, ease: "easeInOut" }}
             className='w-1/2 h-full bg-gradient-to-r from-black to-gray-800'
             />
          </div>
        )}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className='h-screen relative flex flex-col items-center justify-center text-center'>
            <img src="https://images.unsplash.com/photo-1519741497674-611481863552"
              className='absolute w-full h-full object-cover'
            />

            <div className='absolute inset-0 bg-black/60 backdrop-blur-sm' />

            <div className='relative z-10'>
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className='text-6xl md:text-8xl font-bold text-yellow-400'
              >
                Амир & Камилла
              </motion.h1>
              <TypeAnimation
                sequence={[
                  "Мы нашли друг друга...",
                  2000,
                  "И хотим разделить этот прекрасный день с вами",
                ]}
                speed={50}
                className='block mt-4 text-lg text-white'
                repeat={Infinity}
              />
              <button
                onClick={() => setMusicOn(!music_on)}
                className='w-full max-w-xs mx-auto text-2xl md:text-2xl mt-6 px-6 py-2 border-2 border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] rounded-full hover:bg-white hover:text-pink-500 active:scale-90 transition-all duration-300 ease-in-out cursor-pointer'
              >{music_on ? "Выключить музыку" : "Включить музыку"}</button>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className='py-20 px-6 text-center'>
            <h2 className='text-3xl mb-6 text-yellow-400'>Наша история</h2>
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className='text-3xl max-w-xl mx-auto'
            >
              Все началось с простой встречи...
              Но именно она изменила нашу жизнь навсегда.
            </motion.h2>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className='py-20 text-center'
          >
            <h2 className='text-3xl text-yellow-400 mb-10'>Программа дня</h2>

            <div className='max-w-md mx-auto space-y-6 p-5 text-lg'>
              <div className='flex justify-between border-b border-gray-600 pb-2'>
                <span>17:00</span>
                <span>Сбор гостей</span>
              </div>

              <div className='flex justify-between border-b border-gray-600 pb-2'>
                <span>18:00</span>
                <span>Церемония</span>
              </div>

              <div className='flex justify-between border-b border-gray-600 pb-2'>
                <span>19:00</span>
                <span>Банкет</span>
              </div>

              <div className='flex justify-between'>
                <span>20:00</span>
                <span>Танцы и развлечения 🎉</span>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="py-20 text-center">
            <h2 className="text-3xl mb-10 text-yellow-400">Наши моменты</h2>

            <div className="relative w-full max-w-xl mx-auto">
              <motion.img
                key={current}
                src={images[current]}
                onClick={() => setFullScreen(true)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-80 object-cover rounded-2xl cursor-pointer"
              />

              <button
                onClick={() => setCurrent((prev) => (prev - 1 + images.length) % images.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] rounded-full text-2xl cursor-pointer active:scale-90 transition-all duration-300 ease-in-out hover:bg-black"
              >
                ◀
              </button>

              <button
                onClick={() => setCurrent((prev) => (prev + 1) % images.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] rounded-full text-2xl cursor-pointer active:scale-90 transition-all duration-300 ease-in-out hover:bg-black"
              >
                ▶
              </button>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className='py-20 text-center'>
            <h2 className='text-3xl text-yellow-400 mb-6'>
              До свадьбы осталось
            </h2>
            <div className='flex justify-center gap-6 text-xl'>
              <div>{timeleft.days} дней</div>
              <div>{timeleft.hours} часов</div>
              <div>{timeleft.minutes} минут</div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className='py-20 px-6 text-center bg-gradient-to-b from-pink-400 to-purple-600 text-white'>
            <h2 className='text-3xl mb-6'>Приглашаем вас</h2>
            <form onSubmit={handleRSVP} className='flex flex-col items-center gap-4'>
              <input type="text" required placeholder='Ваше имя'
                value={guest_name} onChange={(e) => setGuestName(e.target.value)}
                className='px-4 py-2 font-bold rounded text-black w-64' />
              <input type="email" required placeholder='Ваш Email'
                value={guest_email} onChange={(e) => setGuestEmail(e.target.value)}
                className='px-4 py-2 rounded font-bold text-black w-64' />
              <select
                value={attendance}
                onChange={(e) => setAttendance(e.target.value)}
                className='px-4 py-2 rounded font-bold cursor-pointer hover:bg-white transition-all duration-300 text-black w-64'>
                <option>Приду</option>
                <option>Не смогу</option>
              </select>
              <button type='submit'
                className='w-full max-w-xs mx-auto text-2xl md:text-2xl px-6 py-2 border-2 border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] rounded-full hover:bg-white active:scale-90 hover:text-pink-500 transition-all duration-300 ease-in-out cursor-pointer'
              >Отправить</button>
              {success && (
                <div className='mt-4 text-green-300'>
                  Спасибо! Мы получили ваш ответ ❤️
                </div>
              )}
            </form>
            {guests.length > 0 && <div className='mt-4 text-lg'>{guests.map((g, i) => (
              <div key={i}>
                {g.name} - {g.attendance}
              </div>
            ))}
              <div className='mt-6 text-xl text-yellow-300'>
                Придут: {guests.filter(g => g.attendance === "Приду").length}
              </div>
            </div>}
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className='max-w-5xl mx-auto overflow-hidden rounded-3xl shadow-2xl py-20 text-center'>
            <h2 className='text-3xl text-yellow-400 mb-6'>Наше место</h2>
            <iframe
              className="w-full h-[400px] rounded-2xl"
              src="https://www.google.com/maps?q=41.314428,69.236240&z=16&output=embed"
            />

            <a href="https://www.google.com/maps?q=41.314428, 69.236240"
              target='_blank'
              className='w-full max-w-xs mx-auto text-2xl md:text-2xl inline-block mt-6 px-6 py-3 border border-white rounded-full hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] active:scale-90 hover:bg-white hover:text-black transition ease-in-out cursor-pointer'>
              Открыть в Google Maps
            </a>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className='py-20 text-center bg-black text-white'>
            <h2 className='text-3xl text-yellow-400 mb-6'>Дресс-код</h2>
            <p className='max-w-xl mx-auto mb-6 text-lg'>
              Мы будем рады видеть вас в элегантных нарядах в темных и пастельных тонах 🤍
            </p>
            <div className='flex justify-center gap-4 flex-wrap'>
              {["#f5e6e8", "#0f2076", "#2f2f2e", "#d6f5e8", "#f0f0f0"].map((color, i) => (
                <div key={i}
                  className='w-12 h-12 rounded-full border-2 border-white' style={{ backgroundColor: color }} />
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className='h-screen flex items-center justify-center text-center'>
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className='text-3xl text-yellow-400'
            >
              Будем рады видеть вас ❤️
            </motion.h2>
          </motion.section>

          {fullscreen && (
            <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">

              <motion.img
                key={current}
                src={images[current]}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-full object-contain p-4"
              />

              <button
                onClick={() => setFullScreen(false)}
                className="absolute top-6 right-6 text-white text-3xl cursor-pointer hover:scale-125 transition"
              >
                ✕
              </button>

              <button
                onClick={() => setCurrent((prev) => (prev - 1 + images.length) % images.length)}
                className="absolute left-4 text-white text-4xl cursor-pointer hover:scale-125 transition"
              >
                ◀
              </button>

              <button
                onClick={() => setCurrent((prev) => (prev + 1) % images.length)}
                className="absolute right-4 text-white text-4xl cursor-pointer hover:scale-125 transition"
              >
                ▶
              </button>

            </div>
          )}

          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className='fixed bottom-6 right-6 bg-white font-bold text-black px-4 py-2 rounded-full shadow-lg hover:scale-110 transition cursor-pointer z-50'>
            ↑
          </button>

        </>
      )}
    </div>
  )
}
