# -*- coding: utf-8 -*-
"""Genera el Informe ShowClinic Club en PDF."""
import json, datetime, os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
                                Image, HRFlowable, KeepTogether)

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOGO = os.path.join(BASE, "public", "Imagenes", "logo-showclinic.png")
OUT = os.path.join(BASE, "Informe_ShowClinic_Club.pdf")

# ---- Brand palette ----
PRIMARY = colors.HexColor("#8B6F4E")
ACCENT  = colors.HexColor("#3D342E")
CREAM   = colors.HexColor("#FAF7F3")
SAND    = colors.HexColor("#EFE7DD")
GREYTX  = colors.HexColor("#6B6259")

TIER_COLORS = {
    "Bronce":    colors.HexColor("#8B5E34"),
    "Plata":     colors.HexColor("#8A8D93"),
    "Oro":       colors.HexColor("#C9A227"),
    "Platinium": colors.HexColor("#8B7AAE"),
    "Diamante":  colors.HexColor("#4AA3C7"),
}

# ---- Real metrics ----
with open("/tmp/sc_clients.json") as f:
    clients = json.load(f)

def earned(h): return sum(e["amount"] for e in (h or []) if e.get("type") == "add")
def canjes(h): return [e for e in (h or []) if e.get("type") == "subtract"]
def tier_of(p):
    return ("Diamante" if p >= 30000 else "Platinium" if p >= 20000 else
            "Oro" if p >= 10000 else "Plata" if p >= 5000 else "Bronce")

n_clients   = len(clients)
tot_balance = sum(c["points"] for c in clients)
tot_earned  = sum(earned(c.get("points_history")) for c in clients)
n_canjes    = sum(len(canjes(c.get("points_history"))) for c in clients)
soles_canj  = sum(e.get("solesValue", 0) for c in clients for e in canjes(c.get("points_history")))
avg_pts     = round(tot_balance / n_clients) if n_clients else 0
from collections import Counter
tier_dist = Counter(tier_of(earned(c.get("points_history"))) for c in clients)

today = datetime.date(2026, 6, 16).strftime("%d de junio de %Y")

# ---- Styles ----
styles = getSampleStyleSheet()
H1 = ParagraphStyle("H1", parent=styles["Title"], fontName="Times-Bold",
                    fontSize=26, textColor=ACCENT, leading=30, spaceAfter=2, alignment=TA_LEFT)
SUB = ParagraphStyle("SUB", fontName="Helvetica", fontSize=10.5, textColor=PRIMARY,
                     leading=14, spaceAfter=0, alignment=TA_LEFT, tracking=1)
H2 = ParagraphStyle("H2", fontName="Times-Bold", fontSize=15, textColor=PRIMARY,
                    leading=18, spaceBefore=16, spaceAfter=6)
BODY = ParagraphStyle("BODY", fontName="Helvetica", fontSize=10.3, textColor=GREYTX,
                      leading=15.5, spaceAfter=6, alignment=TA_LEFT)
SMALL = ParagraphStyle("SMALL", fontName="Helvetica", fontSize=8.5, textColor=GREYTX, leading=12)
CELL = ParagraphStyle("CELL", fontName="Helvetica", fontSize=9.5, textColor=ACCENT, leading=13)
CELLB = ParagraphStyle("CELLB", fontName="Helvetica-Bold", fontSize=9.5, textColor=ACCENT, leading=13)
CELLW = ParagraphStyle("CELLW", fontName="Helvetica-Bold", fontSize=10, textColor=colors.white, leading=13)
KPI_NUM = ParagraphStyle("KPI", fontName="Times-Bold", fontSize=22, textColor=ACCENT, leading=24, alignment=TA_CENTER)
KPI_LBL = ParagraphStyle("KPIL", fontName="Helvetica", fontSize=7.8, textColor=GREYTX, leading=10,
                         alignment=TA_CENTER, spaceBefore=2)

def hr(color=SAND, w=1.1):
    return HRFlowable(width="100%", thickness=w, color=color, spaceBefore=8, spaceAfter=8)

story = []

# ---- Header band ----
logo_cell = ""
if os.path.exists(LOGO):
    logo_cell = Image(LOGO, width=20*mm, height=20*mm)

title_block = [
    Paragraph("Informe del Programa", SUB),
    Paragraph("ShowClinic Club", H1),
    Paragraph("Programa de fidelización por puntos &nbsp;·&nbsp; Estética Avanzada, Arequipa", SUB),
]
head = Table([[logo_cell, title_block]], colWidths=[24*mm, 140*mm])
head.setStyle(TableStyle([
    ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
    ("LEFTPADDING", (0,0), (-1,-1), 0),
    ("RIGHTPADDING", (0,0), (-1,-1), 0),
]))
story.append(head)
story.append(Spacer(1, 6))
story.append(HRFlowable(width="100%", thickness=2.5, color=PRIMARY, spaceBefore=4, spaceAfter=2))
story.append(Paragraph(f"Generado el {today}", SMALL))
story.append(Spacer(1, 10))

# ---- 1. Resumen ejecutivo ----
story.append(Paragraph("1. Resumen ejecutivo", H2))
story.append(Paragraph(
    "ShowClinic Club es el programa de fidelización de ShowClinic que recompensa a las pacientes "
    "por cada tratamiento realizado. Por cada <b>S/ 1</b> invertido en tratamientos, la paciente "
    "acumula <b>1 punto ShowClinic</b>, que luego puede canjear por descuentos directos. El programa "
    "está organizado en <b>5 niveles</b> (Bronce a Diamante): mientras más puntos acumula la paciente "
    "a lo largo del tiempo, mayor es su nivel y mayor el porcentaje de descuento al canjear.", BODY))
story.append(Paragraph(
    "Un principio clave del programa es que <b>el nivel se mantiene aunque la paciente canjee sus puntos</b>: "
    "el rango se calcula sobre el total histórico acumulado, no sobre el saldo disponible. Esto premia la "
    "fidelidad a largo plazo y evita que la paciente “baje de categoría” al usar sus beneficios.", BODY))

# ---- 2. KPIs ----
story.append(Paragraph("2. Indicadores actuales del programa", H2))
def kpi(num, lbl):
    return Table([[Paragraph(num, KPI_NUM)], [Paragraph(lbl, KPI_LBL)]],
                 colWidths=[38*mm], rowHeights=[16*mm, 9*mm])
kpis = [
    kpi(f"{n_clients}", "SOCIAS REGISTRADAS"),
    kpi(f"{tot_earned:,}", "PUNTOS ACUMULADOS (HIST.)"),
    kpi(f"{tot_balance:,}", "PUNTOS DISPONIBLES"),
    kpi(f"S/ {soles_canj:,.0f}", "CANJEADO EN DESCUENTOS"),
]
kpi_row = Table([kpis], colWidths=[42*mm]*4)
kpi_row.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,-1), CREAM),
    ("BOX", (0,0), (-1,-1), 0.6, SAND),
    ("INNERGRID", (0,0), (-1,-1), 0.6, SAND),
    ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
    ("TOPPADDING", (0,0), (-1,-1), 6),
    ("BOTTOMPADDING", (0,0), (-1,-1), 6),
]))
story.append(kpi_row)
story.append(Spacer(1, 4))
story.append(Paragraph(
    f"Promedio de puntos disponibles por socia: <b>{avg_pts:,}</b> &nbsp;·&nbsp; "
    f"Canjes realizados a la fecha: <b>{n_canjes}</b>. "
    "El programa se encuentra en fase de arranque; las cifras crecerán conforme se registren las "
    "pacientes atendidas en la clínica.", SMALL))

# ---- 3. Niveles y beneficios ----
story.append(Paragraph("3. Niveles y beneficios", H2))
tier_rows = [[Paragraph("Nivel", CELLW), Paragraph("Rango de puntos", CELLW),
              Paragraph("Descuento al canjear", CELLW), Paragraph("Socias", CELLW)]]
tier_data = [
    ("Bronce", "0 – 4,999 pts", "3%"),
    ("Plata", "5,000 – 9,999 pts", "4%"),
    ("Oro", "10,000 – 19,999 pts", "5%"),
    ("Platinium", "20,000 – 29,999 pts", "6%"),
    ("Diamante", "30,000+ pts", "7%"),
]
for name, rng, canje in tier_data:
    tier_rows.append([
        Paragraph(f'<font color="#{TIER_COLORS[name].hexval()[2:]}"><b>&#9679;</b></font> &nbsp;{name}', CELLB),
        Paragraph(rng, CELL),
        Paragraph(f"<b>{canje}</b>", CELL),
        Paragraph(str(tier_dist.get(name, 0)), CELL),
    ])
tier_table = Table(tier_rows, colWidths=[40*mm, 52*mm, 45*mm, 27*mm])
ts = TableStyle([
    ("BACKGROUND", (0,0), (-1,0), ACCENT),
    ("ROWBACKGROUNDS", (0,1), (-1,-1), [colors.white, CREAM]),
    ("BOX", (0,0), (-1,-1), 0.6, SAND),
    ("INNERGRID", (0,0), (-1,-1), 0.5, SAND),
    ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
    ("TOPPADDING", (0,0), (-1,-1), 7),
    ("BOTTOMPADDING", (0,0), (-1,-1), 7),
    ("LEFTPADDING", (0,0), (-1,-1), 9),
])
tier_table.setStyle(ts)
story.append(tier_table)
story.append(Paragraph("El nivel se determina por el total de puntos acumulados históricamente (suma de todo lo ganado).", SMALL))

# ---- 4. Cómo ganar puntos ----
story.append(Paragraph("4. Cómo se ganan puntos", H2))
earn_rows = [[Paragraph("Concepto", CELLW), Paragraph("Puntos", CELLW), Paragraph("Detalle", CELLW)]]
earn_data = [
    ("Tratamientos", "S/ 1 = 1 pt", "Por cada sol invertido en cualquier tratamiento."),
    ("Bono de bienvenida", "+1,000 pts", "Al registrarse por primera vez en el Club."),
    ("Cumpleaños", "+3,000 pts", "Regalo automático en el mes de cumpleaños."),
    ("Referido", "+3,000 pts", "Por cada paciente nueva referida que se atienda."),
]
for c, p, d in earn_data:
    earn_rows.append([Paragraph(c, CELLB), Paragraph(f"<b>{p}</b>", CELL), Paragraph(d, CELL)])
earn_table = Table(earn_rows, colWidths=[40*mm, 30*mm, 94*mm])
earn_table.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,0), PRIMARY),
    ("ROWBACKGROUNDS", (0,1), (-1,-1), [colors.white, CREAM]),
    ("BOX", (0,0), (-1,-1), 0.6, SAND),
    ("INNERGRID", (0,0), (-1,-1), 0.5, SAND),
    ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
    ("TOPPADDING", (0,0), (-1,-1), 7),
    ("BOTTOMPADDING", (0,0), (-1,-1), 7),
    ("LEFTPADDING", (0,0), (-1,-1), 9),
]))
story.append(earn_table)

# ---- 5. Canje ----
story.append(Paragraph("5. Canje de puntos", H2))
story.append(Paragraph(
    "El valor del canje depende del nivel de la socia. La equivalencia es: "
    "<b>1,000 puntos = descuento equivalente al porcentaje del nivel sobre S/ 1,000</b>. "
    "Por ejemplo, una socia nivel Oro (5%) canjea 1,000 puntos por S/ 50 de descuento; "
    "una socia Diamante (7%) obtiene S/ 70 por los mismos 1,000 puntos. "
    "El canje se registra desde el panel de administración y descuenta el saldo disponible, "
    "<b>sin afectar el nivel alcanzado</b>.", BODY))

# ---- Footer note ----
story.append(Spacer(1, 14))
story.append(hr(PRIMARY, 1.4))
story.append(Paragraph(
    "ShowClinic &#8212; Estética Avanzada &amp; Bienestar &nbsp;·&nbsp; Av. Ejército 616, 5.º piso, Yanahuara, Arequipa "
    "&nbsp;·&nbsp; +51 974 212 114 &nbsp;·&nbsp; showclinicyanahuara@gmail.com", SMALL))
story.append(Paragraph("Documento interno de gestión del programa de fidelización. Cifras al " + today + ".", SMALL))

# ---- Build with footer page number ----
def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(GREYTX)
    canvas.drawRightString(A4[0]-18*mm, 12*mm, f"ShowClinic Club  ·  Página {doc.page}")
    canvas.setStrokeColor(SAND); canvas.setLineWidth(0.6)
    canvas.line(18*mm, 16*mm, A4[0]-18*mm, 16*mm)
    canvas.restoreState()

doc = SimpleDocTemplate(OUT, pagesize=A4,
                        leftMargin=18*mm, rightMargin=18*mm, topMargin=16*mm, bottomMargin=20*mm,
                        title="Informe ShowClinic Club", author="ShowClinic")
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print("PDF generado:", OUT)
