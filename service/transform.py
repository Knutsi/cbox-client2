import xml.etree.ElementTree as ET
import json

class Drug:

	def __init__(self, navn):
		self.navn = navn
		
	def printJSON(self):
		return { 
			'Class': "treatment", 
			'Ident': self.navn.lower(),
			'Title': self.navn
			}



tree = ET.parse('M30v24_full.xml')
root = tree.getroot()

merkevarer_path = "./KatLegemiddelMerkevare/OppfLegemiddelMerkevare/{http://www.kith.no/xmlstds/eresept/forskrivning/2010-04-01}LegemiddelMerkevare"

ns = "{http://www.kith.no/xmlstds/eresept/forskrivning/2010-04-01}"
varenavn_path = ns + "Varenavn"

drugs = {}

for merkevare in root.findall(merkevarer_path):
	varenavn = merkevare.findall(varenavn_path)[0].text
	drugs[varenavn] = Drug(varenavn)
	
result = {
	'Treatments' : [d.printJSON() for (n, d) in drugs.items()]
}
	
#for (name, drug) in drugs.items():
	#print(drug.printJSON())
	
print(json.dumps(result))