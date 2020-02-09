sergiu.iacob.etu@univ-lille.fr, aymane.elidrissi.etu@univ-lille.fr

Fonctionnalités non présentes/présentes mais qui ont des soucis ou bugs:
	- Tout fonctionne parfaitement.

Ajouts ou améliorations éventuels:
	- TP02:
	- On peut ajouter n'importe quel nombre de générateurs.
	- Arrêter et créer les particules est vraiment efficace. Quand on arrête des particules, on passe par les particules vivantes seulement. 
	  Quand on donne naissance à des particules, on passe par les particules mortes seulement. Donc, l'application est beaucoup plus rapide.
	- Segment bonus: si on clique sur la zone "line" mais quelle est proche d'une des bornes du segment, on déplace la plus proche borne du segment.
	- Si la souris sort du canvas elle seras désactiver.
	- Les obstacles sont déplacés seulement si on clique sur une zone proche. (ObstacleManager.clickZone)
	- Si la souris quitte le "canvas", le déplacement des obstacles s'arrête.

	- TP03:
	- On peut ajuster les paramètres (epsilon, deltaTime etc.).
	- Un autre force existe: repulseur (Bonus question 5).
	- Si une particle quitte le "canvas", elle seras arrêté.
	- Pour chaque particule, traitez les collisions avec tous les obstacles puis ajustez la position et la vitesse (Bonus question 18)
	 
Points difficiles:
	- Certains problèmes existaient en raison de la division des nombres "float". Pour ceux-ci, nous avons appliqué quelques "rustines".
	- Par exemple, pour la solution de la question 15, nous avons déplacé la particule de la distance au contour du cercle. Mais il aurait toujours pu être en dehors du cercle, nous avons donc déplacé la particule d'un nombre supplémentaire de pixels vers le centre du cercle.