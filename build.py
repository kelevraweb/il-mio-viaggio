#!/usr/bin/env python3
"""Dal sorgente produce due file:
   - il-mio-viaggio.html  → per l'artifact (asset incorporati come data URI, ~11 MB)
   - index.html           → per il sito (asset in assets/, pagina leggera)"""
import base64, io, os
HERE = os.path.dirname(os.path.abspath(__file__))
src = io.open(os.path.join(HERE, "il-mio-viaggio.src.html"), encoding="utf-8").read()
ASSET = {"{{VIDEO_0}}":("golden.mp4","video/mp4"), "{{VIDEO_1}}":("water.mp4","video/mp4"),
         "{{VIDEO_2}}":("woods.mp4","video/mp4"), "{{VIDEO_3}}":("dawn.mp4","video/mp4"),
         "{{OVERLAY}}":("finestrino.webp","image/webp")}
def uri(nome, mime):
    with open(os.path.join(HERE, "assets", nome), "rb") as f:
        return "data:%s;base64,%s" % (mime, base64.b64encode(f.read()).decode("ascii"))
art = src
for tok,(nome,mime) in ASSET.items(): art = art.replace(tok, uri(nome, mime))
assert "{{" not in art
io.open(os.path.join(HERE, "il-mio-viaggio.html"), "w", encoding="utf-8").write(art)
print("il-mio-viaggio.html (artifact): %.2f MB" % (len(art.encode("utf-8"))/1048576))

site = src
for tok,(nome,mime) in ASSET.items(): site = site.replace(tok, "assets/" + nome)
head, body = site.split("</style>", 1)
site = ('<!doctype html>\n<html lang="it">\n<head>\n' + head + '</style>\n</head>\n<body>' + body + '\n</body>\n</html>\n')
io.open(os.path.join(HERE, "index.html"), "w", encoding="utf-8").write(site)
print("index.html (sito): %.0f KB" % (len(site.encode("utf-8"))/1024))
