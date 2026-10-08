import { motion, type Variants } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { FaUserTie, FaWhatsapp, FaFacebookF } from "react-icons/fa";

interface ProfileCardProps {
  id: string | number;
  name: string;
  role: string;
  imageUrl: string;
  whatsapp?: string;
  facebook?: string;
  colors: {
    primary: string;
    secondary: string;
    gradientPrimary: string;
    textOnPrimary: string;
    primaryMedium: string;
  };
  index: number;
}

export default function ProfileCard({
  id,
  name,
  role,
  imageUrl,
  whatsapp,
  facebook,
  colors,
  index,
}: ProfileCardProps) {
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", delay: index * 0.1 },
    },
  };

  const isEven = index % 2 === 0;
  const accentAttr = isEven ? colors.primary : colors.secondary;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={cardVariants}
    >
      <Tilt
        tiltMaxAngleX={10}
        tiltMaxAngleY={10}
        scale={1.03}
        glareEnable={true}
        glareMaxOpacity={0.2}
        glareColor="#ffffff"
        glarePosition="all"
        transitionSpeed={1500}
      >
        <div
          style={{
            textAlign: "center",
            padding: "2.5rem 2rem",
            background: "rgba(255,255,255,0.03)",
            borderRadius: "20px",
            border: `2px solid ${accentAttr}30`,
            backdropFilter: "blur(10px)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            e.currentTarget.style.boxShadow = `0 20px 50px ${accentAttr}30`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.03)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div
            style={{
              width: "200px",
              height: "200px",
              margin: "0 auto 1.75rem",
              borderRadius: "50%",
              overflow: "hidden",
              border: `4px solid ${accentAttr}`,
              boxShadow: `0 10px 40px ${accentAttr}40`,
              background: "#fff",
            }}
          >
            <img
              src={imageUrl}
              alt={name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top center",
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="%2394a3b8" viewBox="0 0 24 24"%3E%3Cpath d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/%3E%3C/svg%3E';
              }}
            />
          </div>

          <div
            style={{
              width: "50px",
              height: "50px",
              margin: "-3rem auto 1rem",
              position: "relative",
              zIndex: 2,
              background: colors.gradientPrimary,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: colors.textOnPrimary,
              boxShadow: `0 4px 15px ${colors.primaryMedium}`,
            }}
          >
            <FaUserTie size={22} />
          </div>

          <h3
            style={{
              color: "#fff",
              fontSize: "1.2rem",
              fontWeight: 700,
              margin: "0 0 0.5rem",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              lineHeight: 1.3,
            }}
          >
            {name}
          </h3>
          <p
            style={{
              color: accentAttr,
              fontSize: "0.9rem",
              fontWeight: 600,
              margin: "0 0 1.25rem",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            {role}
          </p>
          <div
            style={{
              width: "50px",
              height: "2px",
              background: accentAttr,
              margin: "0 auto 1.5rem",
              opacity: 0.6,
              borderRadius: "2px",
            }}
          ></div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            {whatsapp && whatsapp !== "234" && whatsapp !== "qwe" ? (
              <motion.a
                whileHover={{ scale: 1.2, y: -3 }}
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: "#25D366",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
                title="WhatsApp"
              >
                <FaWhatsapp size={18} />
              </motion.a>
            ) : null}
            {facebook && facebook !== "qweqwe" && facebook !== "qwe" ? (
              <motion.a
                whileHover={{ scale: 1.2, y: -3 }}
                href={
                  facebook.startsWith("http")
                    ? facebook
                    : `https://facebook.com/${facebook}`
                }
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: "#1877F2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
                title="Facebook"
              >
                <FaFacebookF size={18} />
              </motion.a>
            ) : null}
            {(!whatsapp || whatsapp === "234" || whatsapp === "qwe") &&
              (!facebook || facebook === "qweqwe" || facebook === "qwe") && (
                <span
                  style={{
                    color: "#64748b",
                    fontSize: "0.85rem",
                    fontStyle: "italic",
                  }}
                >
                  Sin contacto disponible
                </span>
              )}
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
}
