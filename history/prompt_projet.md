# Main idea
Je veux crée un générateur de mot de passe avec toutes l'utilisation moderne pour que ce soit agréable à utiliser et pour générer les meilleurs mot de passe possible en fonction des prises en charge des sites web (ex: les sites qui n'acceptent pas les caractères spéciaux, les sites qui n'acceptent pas les majuscules, max de caractères, etc.)
# Fonctionnalités
Sélection de jeu de caractères :
- Ascii
- Ascii Extended
- D'autres de ton choix connus
- Tout les unicode avec des subcatégories en mode imprimables de U à U+XXX etc. si tu trouves utile ( on va les générer à partir du code au lieu de stocker une db de symboles)


Tout ça rangé dans l'ordre de compatibilité

- Sélection du nombre de caractère avec un slider (entre 8 et le max que l'utilisateur a choisi, par défaut 256)

- Liste de l'historique de mot de passe (uniquement si copié)

- Affichage de l'entropie et du nombre de combinaisons possibles avec le jeu de caractère choisi.

- Un input caractère interdit
- un input caractère obligatoire
- Un toggle bouton qui permet de mettre un symbole commun (! ? etc.) pour éviter de se faire refuser le mot de passe par le site web. (par défaut activé)


- Sélection des présets
## Presets
Définition d'un preset :
Il y a deux présets, ceux qui sont déjà implémentés dans le code et ceux que l'utilisateur peut créer.

Les présets ont un nom, et c'est une sauvegarde des paramètres de génération de mot de passe. (longueur, jeu de caractères, etc.)
## Iées d'UI
Faire comme une liste en ordre alphabétique des présets. avec dossier et sous dossier pour les classer.
Par exemple si pour microsoft on a 10 services ça se met dans les présets microsoft. (on peut utiliser l'icône de   dossier en néon pour aller avec le thème)

# Idées d'UI
Il doit y avoir du orange, mais dark orange.
Champ input doit avoir 2 icones dans le champ input 1 pour show/hide (icone oeil) et un pour en générer un nouveau (icone de dés) tu peux retrouver l'image input.png pour te montrer les 2 boutons (sans l'indice strong weak)
# Autre
Met des infos bulles pour expliquer les fonctionnalités, tu peux adapter le style pour correspondre au thème si nécessaire..

On enregistre dans le localStorage

On va pouvoir exporter les présets

Le projet doit utiliser react js. Et si tu dois utiliser un language je ne veux pas de javascript serveur j'aimerai aller sur du rust, fais moi un rapport en markdown sur le stack que tu comptes utiliser.
# Historique 
- Dans l'histoique on voit la liste des mots de passe générés et copiés dans l'ordre inverse de création.
- On peut modifier le nom du mot de passe 
- On peut supprimer un mot de passe.
- On peut copier un mot de passe.
- On peut supprimer l'historique
- On peut en mettre un au favori qui résiste à la supression
Je vais te donner un cas et dis moi si il faut en faire une fonctionnalité séparée de l'hisorique:
"Imaginon que je veux faire un lab informatique temporaire et que j'ai besoin de générer plein de mots de passe, et bah j'aimerai le répertoire /historique (à voir si on sépére),  comme ça je peux copier le mdp de debian 1, root debian 1 etc.)