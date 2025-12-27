import { computed, ref } from "vue";
import type { QuoteItem } from "../types/quote";

// On importe le JSON "comme un fichier de données".
// Vite l'intègre au build, donc pas besoin d'aller le chercher via une API.
import rawQuotes from "../data/quotes.json";

/**
 * useQuotes() = une “boîte à outils” pour gérer les citations.
 *
 * En Vue, un "composable" c’est juste une fonction qui :
 * - garde un petit bout d’état (comme une mini-mémoire)
 * - calcule des valeurs à partir de cet état
 * - expose des actions (des fonctions) pour modifier cet état
 *
 * L’intérêt :
 * - Tes composants (HomeView, Citation.vue, etc.) restent simples :
 *   ils affichent, ils appellent une action, mais ils ne gèrent pas la logique.
 * - Toute la logique “choisir une citation” est centralisée ici.
 */

/**
 * Liste complète des citations.
 *
 * `rawQuotes` vient d'un fichier JSON, donc TypeScript ne peut pas "deviner" son type.
 * On lui dit : "considère que c'est un tableau de QuoteItem".
 *
 * À retenir :
 * - TypeScript vérifie surtout au moment d’écrire du code.
 * - Il ne vérifie pas automatiquement que ton JSON est correct au runtime.
 *   (si tu mets un JSON cassé, ça peut bugger quand même)
 */
const quotes = rawQuotes as QuoteItem[];

/**
 * Choisit un nouvel index aléatoire.
 *
 * Pourquoi on parle d’index ?
 * - `quotes` est un tableau.
 * - Une citation se récupère par sa position : quotes[0], quotes[1], etc.
 *
 * On essaie d’éviter de retomber sur le même index,
 * sinon le bouton “Nouvelle citation” peut afficher la même citation.
 */
function pickNewIndex(current: number, length: number): number {
	// S'il y a 0 ou 1 citation, pas de choix possible : on revient à 0.
	if (length <= 1) return 0;

	let next = current;

	// Tant qu’on tombe sur la même position, on retire au sort.
	while (next === current) {
		next = Math.floor(Math.random() * length);
	}

	return next;
}

export function useQuotes() {
	/**
	 * currentIndex = “la position de la citation affichée”.
	 *
	 * ref(0) :
	 * - crée une valeur réactive (Vue la surveille)
	 * - si on la change, l’interface se met à jour automatiquement
	 */
	const currentIndex = ref(0);

	/**
	 * currentQuote = “la citation correspondant à currentIndex”.
	 *
	 * computed(...) :
	 * - c’est un calcul automatique basé sur des valeurs réactives
	 * - ici : basé sur currentIndex
	 *
	 * Pourquoi computed ?
	 * - Tu n’as pas besoin de recalculer à la main à chaque clic.
	 * - Vue le fait pour toi quand currentIndex change.
	 *
	 * On renvoie `null` si le tableau est vide, pour éviter de crasher l’UI.
	 */
	const currentQuote = computed<QuoteItem | null>(() => {
		if (!quotes.length) return null;
		return quotes[currentIndex.value] ?? null;
	});

	/**
	 * nextQuote() = ce que le bouton “Nouvelle citation” déclenche.
	 *
	 * Concrètement :
	 * - on ne modifie PAS le tableau de citations
	 * - on change juste l’index courant
	 * => et comme currentQuote dépend de currentIndex,
	 *    l’écran se met à jour automatiquement.
	 */
	function nextQuote() {
		currentIndex.value = pickNewIndex(currentIndex.value, quotes.length);
	}

	/**
	 * Ce qu’on “rend disponible” à l’extérieur (HomeView, etc.)
	 *
	 * - currentQuote : la citation à afficher
	 * - nextQuote : la fonction à appeler quand on veut changer
	 *
	 * - quotes / currentIndex : utiles pour debug ou futures features
	 *   (ex: afficher le nombre total, faire une liste, etc.)
	 */
	return {
		quotes,
		currentIndex,
		currentQuote,
		nextQuote,
	};
}
