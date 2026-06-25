import { NextResponse } from "next/server";
import { Resend } from "resend";
import { PAQUETES } from "../../brief/constants";
import type { BriefData } from "../../brief/types";

// Cambia esta dirección por el correo donde quieres recibir los briefs.
const DESTINATION_EMAIL = "hola@ceibavisual.com";
const FROM_EMAIL = "Ceiba Visual <onboarding@resend.dev>";

type BriefPayload = BriefData & { enviadoEn: string };

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:8px 14px;border-bottom:1px solid #DAD6C8;font-size:13px;color:#52514C;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="padding:8px 14px;border-bottom:1px solid #DAD6C8;font-size:14px;color:#2D2D2D;">${value || "—"}</td>
    </tr>`;
}

function section(title: string) {
  return `
    <tr>
      <td colspan="2" style="padding:18px 14px 6px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#7C8C70;font-weight:700;">${title}</td>
    </tr>`;
}

function nombrePaquete(id: string) {
  return PAQUETES.find((p) => p.id === id)?.nombre ?? id;
}

function buildHtml(payload: BriefPayload) {
  const fecha = new Date(payload.enviadoEn).toLocaleString("es-GT", {
    dateStyle: "long",
    timeStyle: "short",
  });

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#F4F1EA;padding:24px;">
    <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #DAD6C8;border-radius:12px;overflow:hidden;">
      <div style="background:#2D2D2D;color:#F4F1EA;padding:20px 24px;">
        <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#7C8C70;">Ceiba Visual</div>
        <div style="font-size:18px;font-weight:700;margin-top:4px;">Nuevo brief de proyecto</div>
        <div style="font-size:12px;color:#b8b4a8;margin-top:4px;">${fecha}</div>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        ${section("Identidad")}
        ${row("Negocio", payload.negocio)}
        ${row("Contacto", payload.contacto)}
        ${row("WhatsApp", payload.whatsapp)}
        ${row("Correo", payload.correo)}
        ${row("Ubicación", payload.ubicacion)}
        ${row("Sucursales", payload.sucursales)}

        ${section("El negocio")}
        ${row("Descripción", payload.descripcion)}
        ${row("Diferenciador", payload.diferenciador)}
        ${row("Antigüedad", payload.antiguedad)}
        ${row("Cliente ideal", payload.clienteIdeal)}

        ${section("Paquete")}
        ${row("Paquete de interés", nombrePaquete(payload.paquete))}

        ${section("Marca")}
        ${row("¿Tienen logo?", payload.logo)}
        ${row("Logo adjunto", payload.logoFile ? "Sí (ver adjunto)" : "No")}
        ${row("Colores de marca", payload.colores)}
        ${row("Redes sociales", payload.redes)}

        ${section("Necesidades")}
        ${row("Detalle de necesidades", payload.funcionesExtra)}
      </table>
    </div>
  </div>`;
}

function buildText(payload: BriefPayload) {
  const lines = [
    "NUEVO BRIEF DE PROYECTO — CEIBA VISUAL",
    `Enviado: ${new Date(payload.enviadoEn).toLocaleString("es-GT")}`,
    "",
    "— Identidad —",
    `Negocio: ${payload.negocio}`,
    `Contacto: ${payload.contacto}`,
    `WhatsApp: ${payload.whatsapp}`,
    `Correo: ${payload.correo}`,
    `Ubicación: ${payload.ubicacion}`,
    `Sucursales: ${payload.sucursales}`,
    "",
    "— El negocio —",
    `Descripción: ${payload.descripcion}`,
    `Diferenciador: ${payload.diferenciador}`,
    `Antigüedad: ${payload.antiguedad}`,
    `Cliente ideal: ${payload.clienteIdeal}`,
    "",
    "— Paquete —",
    `Paquete de interés: ${nombrePaquete(payload.paquete)}`,
    "",
    "— Marca —",
    `¿Tienen logo?: ${payload.logo}`,
    `Logo adjunto: ${payload.logoFile ? "Sí (ver adjunto)" : "No"}`,
    `Colores de marca: ${payload.colores}`,
    `Redes sociales: ${payload.redes}`,
    "",
    "— Necesidades —",
    `Detalle de necesidades: ${payload.funcionesExtra}`,
  ];
  return lines.join("\n");
}

const EXT_BY_MIME: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/svg+xml": "svg",
};

function parseLogoAttachment(logoFile: string, negocio: string) {
  const match = /^data:(.+);base64,(.+)$/.exec(logoFile);
  if (!match) return null;
  const [, mime, base64] = match;
  const ext = EXT_BY_MIME[mime!] ?? "png";
  const safeName = negocio.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") || "cliente";
  return {
    filename: `logo-${safeName}.${ext}`,
    content: base64!,
    contentType: mime,
  };
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "RESEND_API_KEY no está configurada en el servidor." },
      { status: 500 }
    );
  }

  let payload: BriefPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  if (!payload?.negocio || !payload?.contacto || !payload?.whatsapp) {
    return NextResponse.json(
      { error: "Faltan campos requeridos en el brief." },
      { status: 400 }
    );
  }

  const resend = new Resend(apiKey);
  const logoAttachment = payload.logoFile
    ? parseLogoAttachment(payload.logoFile, payload.negocio)
    : null;

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: DESTINATION_EMAIL,
    subject: `Brief de proyecto — ${payload.negocio}`,
    html: buildHtml(payload),
    text: buildText(payload),
    attachments: logoAttachment ? [logoAttachment] : undefined,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
