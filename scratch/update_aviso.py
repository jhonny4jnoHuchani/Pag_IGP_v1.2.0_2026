import sys
import re

with open(r'd:\Utic_2026\Area Desarrollo\front_alvieri\gasypetroquimica_2026\src\pages\AvisosPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """  const todosLosAvisos = useMemo(() => {
    return (recursos?.upea_publicaciones || [])
      .filter((pub) => {
        const titulo = pub.publicaciones_titulo?.toUpperCase() || "";
        const tipo = pub.publicaciones_tipo?.toUpperCase() || "";
        return (
          titulo.includes("AVISO") ||
          titulo.includes("COMUNICADO") ||
          tipo.includes("AVISO") ||
          tipo.includes("COMUNICADO") ||
          tipo.includes("GACETA") ||
          titulo.includes("GACETA")
        );
      })
      .map((pub) => ({
        id: pub.publicaciones_id,
        titulo: pub.publicaciones_titulo,
        descripcion: pub.publicaciones_descripcion,
        fecha: pub.publicaciones_fecha,
        imagen: pub.publicaciones_imagen,
        tipo: pub.publicaciones_tipo || "AVISO",
        autor: pub.publicaciones_autor,
        enlace: pub.publicaciones_documento || "#",
      }))
      .sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
      );
  }, [recursos]);"""

replacement = """  const todosLosAvisos = useMemo(() => {
    const pubs = (recursos?.upea_publicaciones || [])
      .filter((pub) => {
        const titulo = pub.publicaciones_titulo?.toUpperCase() || "";
        const tipo = pub.publicaciones_tipo?.toUpperCase() || "";
        return (
          titulo.includes("AVISO") ||
          titulo.includes("COMUNICADO") ||
          tipo.includes("AVISO") ||
          tipo.includes("COMUNICADO") ||
          tipo.includes("GACETA") ||
          titulo.includes("GACETA")
        );
      })
      .map((pub) => ({
        id: f"pub-{pub.publicaciones_id}",
        titulo: pub.publicaciones_titulo,
        descripcion: pub.publicaciones_descripcion,
        fecha: pub.publicaciones_fecha,
        imagen: pub.publicaciones_imagen,
        tipo: pub.publicaciones_tipo || "AVISO",
        autor: pub.publicaciones_autor,
        enlace: pub.publicaciones_documento || "#",
      }));

    const convs = (recursos?.convocatorias || [])
      .filter((conv) => {
        const type = (conv.tipo_conv_comun?.tipo_conv_comun_titulo || "").toUpperCase();
        return type === "AVISOS" && conv.con_estado === "1";
      })
      .map((conv) => ({
        id: f"conv-{conv.idconvocatorias}",
        titulo: conv.con_titulo,
        descripcion: conv.con_descripcion,
        fecha: conv.con_fecha_inicio,
        imagen: conv.con_foto_portada,
        tipo: conv.tipo_conv_comun?.tipo_conv_comun_titulo || "AVISO",
        autor: "Dirección",
        enlace: "#",
      }));

    return [...pubs, ...convs].sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
    );
  }, [recursos]);"""

# Normaliza espacios y retornos de carro
def normalize_spaces(text):
    return re.sub(r'\s+', r'\\s+', text.replace('(', r'\(').replace(')', r'\)').replace('[', r'\[').replace(']', r'\]').replace('{', r'\{').replace('}', r'\}').replace('.', r'\.').replace('+', r'\+').replace('*', r'\*').replace('?', r'\?').replace('|', r'\|').replace('^', r'\^').replace('$', r'\$'))

import re
# Usa match the string
new_content = re.sub(normalize_spaces(target), replacement.replace('f"pub-', '`pub-${').replace('}"', '}`').replace('f"conv-', '`conv-${'), content)

with open(r'd:\Utic_2026\Area Desarrollo\front_alvieri\gasypetroquimica_2026\src\pages\AvisosPage.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Done')
