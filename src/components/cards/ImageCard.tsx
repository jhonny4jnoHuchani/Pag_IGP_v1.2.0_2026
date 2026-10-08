import { useState } from "react";
import { sanitizeHtml } from '../../utils/sanitize';
import { motion } from "framer-motion";
import {
  FaSearch,
  FaUserEdit,
  FaDownload,
  FaEye,
  FaCalendarAlt,
} from "react-icons/fa";

interface ImageCardProps {
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  dateStr?: string;
  tag?: string;
  tagColor?: string;
  colors: any;
  linkUrl?: string; // external link if needed
  author?: string | null;
  index?: number;
  onImageClick?: (url: string) => void;
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function ImageCard({
  title,
  description,
  imageUrl,
  dateStr,
  tag,
  tagColor = "#f59e0b",
  colors,
  linkUrl,
  author,
  index = 0,
  onImageClick,
  onClick,
  children,
}: ImageCardProps) {
  const [hovered, setHovered] = useState(false);

  // Parse Date smoothly
  let formattedDate = { dia: "--", mes: "---", anio: "----" };
  if (dateStr) {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      formattedDate = {
        dia: d.getDate().toString().padStart(2, "0"),
        mes: d.toLocaleDateString("es-BO", { month: "short" }).toUpperCase(),
        anio: d.getFullYear().toString(),
      };
    }
  }

  // Animaciones tipo creativas / alternadas
  const animations = [
    { x: -50, y: 50 },
    { x: 50, y: 50 },
    { x: 0, y: 50 },
  ];
  const anim = animations[index % animations.length];

  return (
    <motion.div
      initial={{ opacity: 0, x: anim.x, y: anim.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onClick}
        style={{
          background: `linear-gradient(160deg, ${colors?.primary || "#1e293b"} 0%, #0f172a 100%)`,
          borderRadius: "16px",
          overflow: "hidden",
          position: "relative",
          borderLeft: `5px solid ${tagColor}`,
          boxShadow: hovered
            ? `0 20px 40px ${colors?.primary}40`
            : `0 10px 25px rgba(0,0,0,0.4)`,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "box-shadow 0.3s ease",
          cursor: onClick ? "pointer" : "default",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: `linear-gradient(90deg, #FFD700, ${tagColor}, transparent)`,
          }}
        ></div>

        {tag && (
          <div
            style={{
              position: "absolute",
              top: "1rem",
              right: "-2.5rem",
              transform: "rotate(45deg)",
              background: tagColor,
              color: "#fff",
              padding: "0.4rem 3rem",
              fontSize: "0.7rem",
              fontWeight: 800,
              textTransform: "uppercase",
              zIndex: 5,
            }}
          >
            {tag}
          </div>
        )}

        <div
          style={{
            position: "relative",
            height: "180px",
            background: "#000",
            cursor: imageUrl && onImageClick ? "pointer" : "default",
            overflow: "hidden",
          }}
          onClick={() => imageUrl && onImageClick && onImageClick(imageUrl)}
        >
          {imageUrl ? (
            <motion.img
              src={imageUrl}
              alt={title}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.5 }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: hovered ? 0.9 : 1,
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.05)",
              }}
            >
              <FaEye size={40} color="rgba(255,255,255,0.2)" />
            </div>
          )}
          {imageUrl && onImageClick && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,0.5)",
                opacity: hovered ? 1 : 0,
                transition: "opacity 0.3s",
              }}
            >
              <span
                style={{
                  background: "#fff",
                  padding: "0.6rem 1.2rem",
                  borderRadius: "20px",
                  color: colors?.primary || "#000",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <FaSearch /> Ampliar
              </span>
            </div>
          )}
        </div>

        <div
          style={{
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            {dateStr && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: "8px",
                  padding: "0.5rem",
                  minWidth: "50px",
                }}
              >
                <span
                  style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 800 }}
                >
                  {formattedDate.dia}
                </span>
                <span
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "0.65rem",
                    fontWeight: 600,
                  }}
                >
                  {formattedDate.mes}
                </span>
              </div>
            )}
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 800,
                color: "#fff",
                margin: 0,
                lineHeight: 1.4,
                flex: 1,
              }}
            >
              {title}
            </h3>
          </div>

          <div
            style={{
              color: "rgba(255,255,255,0.75)",
              fontSize: "0.85rem",
              lineHeight: 1.6,
              flex: 1,
              marginBottom: "1rem",
            }}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(description || "") }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "auto",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              paddingTop: "1rem",
            }}
          >
            {author ? (
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.6)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <FaUserEdit /> {author}
              </span>
            ) : (
              <span />
            )}

            {linkUrl && (
              <a
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.4rem 0.8rem",
                  background: "#fff",
                  color: colors?.primary || "#000",
                  borderRadius: "20px",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              >
                <FaDownload /> Acceder
              </a>
            )}
          </div>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
