import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Home() {
  const [opened, setOpened] = useState(false);

  return (
    <div className="home-page">
      <section className="hero-section">
        <h1 className="hero-title">Trà sữa dâu</h1>

        {!opened && (
          <p className="hero-subtitle">
            Click vào ly để khám phá thành phần
          </p>
        )}

        <div
          className="drink-wrapper"
          onClick={() => setOpened(true)}
        >
          {/* trạng thái đóng */}
          {!opened && (
            <motion.img
              src="/drink_static_state.png"
              alt="closed drink"
              className="drink-img"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* trạng thái mở */}
          <AnimatePresence>
            {opened && (
              <>
                <motion.img
                  src="/drink_open.png"
                  alt="open drink"
                  className="drink-open"
                  initial={{
                    opacity: 0,
                    scale: 0.7,
                    rotate: -20
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: 0
                  }}
                  transition={{
                    duration: 0.7,
                    ease: "easeOut"
                  }}
                />

                <motion.img
                  src="/liquid_splash.png"
                  alt="splash"
                  className="splash-img"
                  initial={{
                    opacity: 0,
                    scale: 0.5,
                    y: 80
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0
                  }}
                  transition={{
                    delay: 0.25,
                    duration: 0.6
                  }}
                />
              </>
            )}
          </AnimatePresence>
        </div>

        {/* info panel */}
        <AnimatePresence>
          {opened && (
            <motion.div
              className="info-panel"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <h2>Fresh Strawberry Milk Tea</h2>

              <div className="ingredients">
                <span>🍓 Dâu tươi</span>
                <span>🥛 Sữa dâu</span>
                <span>🧋 Trà sữa</span>
              </div>

              <div className="price-tag">35.000đ</div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

export default Home;