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
  const audio_ref = useRef(null)
  const canvas_ref = useRef(null)
  const [current, setCurrent] = useState(0)
  const [attendance, setAttendance] = useState("Приду")

  const images = [
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486",
    "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
  ]

  const weeding_date = new Date("2026-06-16")

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
    if (!opened) return

    const canvas = canvas_ref.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = canvas.width = window.innerWidth
    let height = canvas.height = window.innerHeight

    const petals = Array.from({ length: 30 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 6 + 2,
      d: Math.random() * 1
    }))

    function draw() {
      ctx.clearRect(0, 0, width, height)

      petals.forEach(p => {
        ctx.beginPath()

        ctx.moveTo(p.x, p.y)
        ctx.bezierCurveTo(
          p.x + 5, p.y - 5,
          p.x + 10, p.y + 5,
          p.x, p.y + 10
        )

        ctx.bezierCurveTo(
          p.x - 10, p.y + 5,
          p.x - 5, p.y + 5,
          p.x, p.y
        )

        ctx.fillStyle = "rgba(255,182,193, 0.9)"
        ctx.fill()

        p.y += p.d + 0.7
        p.x += Math.sin(p.y * 0.02)

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
  }

  const handleRSVP = async (e) => {
    e.preventDefault();

    const TOKEN = "8651976770:AAGKju6E3LTG7zT0Za5MRBvgVbMOzBw2UN4"
    const CHAT_ID = "114761827"

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
      
      alert("Спасибо! Мы получили ваш ответ ❤️")

    } catch (error) {
      alert("Ошибка отправки 😢");
    }
  };

  return (
    <div className="bg-black text-white overflow-hidden font-serif">
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
            className='border border-white px-8 py-3 rounded-full hover:bg-white hover:text-pink-500 active:scale-90 transition-all duration-300 cursor-pointer'
          >
            Открыть
          </motion.button>
        </div>
      )}

      {/* {!opened && (
        <div className="fixed inset-0 flex z-50">
          <motion.div initial={{ x: 0 }}
            animate={{ x: opened ? "-100%" : "0%" }}
            transition={{ duration: 1.5 }}
            className='w-1/2 bg-black flex items-center justify-end'
          >
            <button onClick={handleOpen}
              className='mr-4 px-6 py-3 border border-white text-white rounded-full hover:bg-white hover:text-black transition-all duration-all cursor-pointer'>
              Открыть
            </button>
          </motion.div>

          <motion.div
            initial={{ x: 0 }}
            animate={{ x: opened ? "100%" : "0%" }}
            transition={{ duration: 1.5 }}
            className='w-1/2 bg-black flex items-center justify-start'
          />
        </div>
      )} */}

      {opened && (
        <>
          <section className='h-screen relative flex flex-col items-center justify-center text-center'>
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
                className='mt-6 px-6 py-2 border-2 border-white rounded-full hover:bg-white hover:text-pink-500 active:scale-90 transition-all duration-300 cursor-pointer'
              >{music_on ? "Выключить музыку" : "Включить музыку"}</button>
            </div>
          </section>

          <section className='py-20 px-6 text-center'>
            <h2 className='text-3xl mb-6 text-yellow-400'>Наша история</h2>
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className='text-3xl max-w-xl mx-auto'
            >
              Все началось с простой встречи...
              Но именно она изменила нашу жизнь навсегда.
            </motion.h2>
          </section>


          <section className="py-20 text-center">
            <h2 className="text-3xl mb-10 text-yellow-400">Наши моменты</h2>

            <div className="relative w-full max-w-xl mx-auto">

              <motion.img
                key={current}
                src={images[current]}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-80 object-cover rounded-2xl"
              />

              <button
                onClick={() => setCurrent((prev) => (prev - 1 + images.length) % images.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-white text-2xl cursor-pointer active:scale-90 transition-all duration-300 hover:bg-black"
              >
                ◀
              </button>

              <button
                onClick={() => setCurrent((prev) => (prev + 1) % images.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-2xl cursor-pointer active:scale-90 transition-all duration-300 hover:bg-black"
              >
                ▶
              </button>
            </div>
          </section>


          {/* <section className="py-20 px-6 text-center">
            <h2 className="text-3xl mb-10 text-yellow-400">Наши моменты</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                "https://images.unsplash.com/photo-1522673607200-164d1b6ce486",
                "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
                "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
              ].map((img, i) => (
                <motion.img
                  key={i}
                  src={img}
                  whileHover={{ scale: 1.05 }}
                  className="rounded-xl object-cover h-40 w-full"
                />
              ))}
            </div>
          </section> */}

          <section className='py-20 text-center'>
            <h2 className='text-3xl text-yellow-400 mb-6'>
              До свадьбы осталось
            </h2>
            <div className='flex justify-center gap-6 text-xl'>
              <div>{timeleft.days} дней</div>
              <div>{timeleft.hours} часов</div>
              <div>{timeleft.minutes} минут</div>
            </div>
          </section>

          <section className='py-20 px-6 text-center bg-gradient-to-b from-pink-400 to-purple-600 text-white'>
            <h2 className='text-3xl mb-6'>RSVP</h2>
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
                className='px-6 py-2 border-2 border-white rounded-full hover:bg-white active:scale-90 hover:text-pink-500 transition-all duration-300 cursor-pointer'
              >Отправить</button>
            </form>
            {guests.length > 0 && <div className='mt-4 text-lg'>{guests.map((g, i) => (
              <div key={i}>
                {g.name} - {g.attendance}
              </div>
            ))}
            </div>}
          </section>

          <section className='max-w-5xl mx-auto overflow-hidden rounded-3xl shadow-2xl py-20 text-center'>
            <h2 className='text-3xl text-yellow-400 mb-6'>Наше место</h2>
            <a href="https://www.google.com/maps?q=41.314428, 69.236240"
              target='_blank'
              className='inline-block mt-6 px-6 py-3 border border-white rounded-full active:scale-90 hover:bg-white hover:text-black transition cursor-pointer'>
              Открыть в Google Maps
            </a>
          </section>

          <section className='h-screen flex items-center justify-center text-center'>
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className='text-3xl text-yellow-400'
            >
              Будем рады видеть вас ❤️
            </motion.h2>
          </section>

        </>
      )}
    </div>
  )
}
