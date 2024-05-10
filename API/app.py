from flask import Flask, jsonify, request
import requests
from bs4 import BeautifulSoup
import re
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/scrape', methods=['POST'])
def scrape_logements():
    selected_country = request.json.get('country')
    selected_country_name = selected_country[0]
    selected_country_link = selected_country[1]
    
    max_price = request.json.get('maxPrice', None)

    url1 = selected_country_link
    
    lien_recup = []
    response1 = requests.get(url1)
    soup1 = BeautifulSoup(response1.text, 'html.parser')

    div_chage_page = soup1.find_all('div', class_='div-resi-dispos__left__main')
    for div in div_chage_page:
        a_tags = div.find_all('a')[:1]  # Récupérer les deux premières balises <a>
        for a_tag in a_tags:
            href = a_tag.get('href')
            text = a_tag.text.strip()
            lien_recup.append({'lien': "https://www.location-etudiant.fr" + href})
    
    
    url = lien_recup[0]['lien']
    scraped_data = []

    while True:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')

        residence_divs = soup.find_all('div', class_='div-residence__main')
        for residence_div in residence_divs:
            title_div = residence_div.find('div', class_='div-residence__main__title')
            link = title_div.find('a')
            href = link.get('href')
            text = link.text.strip()  

            ville_div = residence_div.find('div', class_='div-residence__main__address')
            ville_span = ville_div.find('span', class_='first_span')
            ville_text_full = ville_span.text.strip()
            ville_text = ville_text_full.split('- ')[1].strip()  # Extraction du nom de la ville après le texte "- "

            prix_div = residence_div.find('div', class_='div-residence__main__subtitle')
            prix_span = prix_div.find('div')
            prix_text = re.sub(r'€', '', prix_span.text.strip())
            prix_text = prix_text.replace(',', '')
            prix_text = prix_text.strip()

            # Vérifiez si le prix est inférieur ou égal au prix maximal
            if max_price == '' or float(prix_text) <= float(max_price):
                scraped_data.append({'titre': text, 'lien': "https://www.location-etudiant.fr" + href, 'prix': prix_text, 'ville': ville_text})


        pagination_div = soup.find('div', class_='pagination')

        if pagination_div:
            next_page_link = pagination_div.find('a', rel='next')

            if next_page_link:
                url = next_page_link.get('href')
            else:
                break
        else:
            break
    
    # Trier les données par prix croissant
    scraped_data = sorted(scraped_data, key=lambda x: float(x['prix']))

    return jsonify(scraped_data)


@app.route('/api/villes', methods=['GET'])
def scrape_villes():
    url = 'https://www.location-etudiant.fr/carte-residences-etudiantes-en-france.html'
    villes_data = []

    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    div_origine = soup.find('div', class_='regie-04')
    table_origine = div_origine.find('table')

    tr_list = table_origine.find_all('tr')  # Trouver toutes les balises <tr> dans la table

    for tr in tr_list:
        td_list = tr.find_all('td')  # Trouver toutes les balises <td> à l'intérieur de chaque <tr>
        for td in td_list:
            a_tag = td.find('a')
            if a_tag:
                href = a_tag.get('href')
                name = a_tag.text.strip()
                villes_data.append({'nom': name, 'lien': "https://www.location-etudiant.fr/"+href})

    return jsonify(villes_data)


if __name__ == '__main__':
    app.run(debug=True)
