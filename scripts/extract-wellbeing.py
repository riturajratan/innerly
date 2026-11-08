"""Extract published WHR 2026 life evaluations; no inferred or interpolated values.
Usage: python3 scripts/extract-wellbeing.py /path/to/WHR26_Data_Figure_2.1.xlsx
Source: https://files.worldhappiness.report/WHR26_Data_Figure_2.1.xlsx
"""
import json, pathlib, sys, zipfile, xml.etree.ElementTree as ET
ns = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
with zipfile.ZipFile(sys.argv[1]) as source:
    strings = [''.join(s.itertext()) for s in ET.fromstring(source.read('xl/sharedStrings.xml')).findall('s:si', ns)]
    rows = []
    for row in ET.fromstring(source.read('xl/worksheets/sheet1.xml')).findall('.//s:sheetData/s:row', ns):
        values = {}
        for cell in row:
            value = cell.find('s:v', ns)
            if value is not None:
                col = ''.join(filter(str.isalpha, cell.attrib['r']))
                values[col] = strings[int(value.text)] if cell.get('t') == 's' else float(value.text)
        if isinstance(values.get('A'), float) and values['A'] >= 2020:
            rows.append(values)
latest = sorted(r['C'] for r in rows if r['A'] == 2025)
data = {name: [[int(r['A']), r['D'], r['E'], r['F']] for r in sorted(rows, key=lambda r: r['A']) if r['C'] == name] for name in latest}
output = pathlib.Path(__file__).resolve().parents[1] / 'dist/data/world-wellbeing.mjs'
output.write_text('// WHR 2026 Figure 2.1. Each row: [final survey year, three-year mean, lower 95% CI, upper 95% CI].\n// Source: https://files.worldhappiness.report/WHR26_Data_Figure_2.1.xlsx\nexport const wellbeingData = ' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n')
print(f'Extracted {len(data)} countries/territories; years 2020–2025. Wrote {output}')
