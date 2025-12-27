<script setup lang="ts">
	/**
	 * HomeView = la page d’accueil (URL "/")
	 *
	 * À retenir :
	 * - Le router dit : “quand on va sur /, on affiche HomeView”.
	 * - HomeView ne “fabrique” pas les citations : elle les affiche.
	 * - Toute la logique “quelle citation montrer ?” est dans useQuotes().
	 */

	import { useQuotes } from "../composables/useQuotes";

	/**
	 * Composants = petites briques d’interface.
	 *
	 * Idée :
	 * - Au lieu d’avoir une grosse page avec plein de HTML,
	 *   on découpe en petites pièces réutilisables.
	 * - Chaque composant fait une chose simple (photo, texte, auteur, etc.).
	 */
	import Photo from "../components/Photo.vue";
	import Citation from "../components/Citation.vue";
	import Author from "../components/Author.vue";
	import Bio from "../components/Bio.vue";
	import ShareButtons from "../components/ShareButtons.vue";
	import ThemeToggle from "../components/ThemeToggle.vue";

	/**
	 * useQuotes() nous donne :
	 * - currentQuote : “la citation à afficher maintenant”
	 * - nextQuote() : “passe à une autre citation”
	 *
	 * Comme currentQuote est réactif, l’écran se met à jour tout seul quand on clique.
	 */
	const { currentQuote, nextQuote } = useQuotes();
	</script>

	<template>
		<main class="page">
			<!-- Titre de la page -->
			<header class="header">
				<h1 class="h1">Les piliers de la sagesse</h1>

				<!--
					ThemeToggle :
					- petit interrupteur qui change data-theme sur <html>
					- ton SCSS écoute [data-theme="light/dark"] et change les variables CSS
				-->
				<ThemeToggle />
			</header>

			<!--
				Filet de sécurité :
				- si ton JSON est vide (ou mal importé), currentQuote vaut null
				- on affiche un message plutôt qu’une page cassée
			-->
			<p v-if="!currentQuote" class="muted">Aucune citation disponible.</p>

			<!--
				La “carte” principale :
				- on affiche la citation + infos auteur + actions
			-->
			<section v-else class="card">
				<header class="card__header">
					<!--
						Photo :
						- si pas de photo dans le JSON, Photo affiche un fallback
						- donc HomeView n’a pas besoin de gérer ce cas
					-->
					<Photo
						:src="currentQuote.author?.photo"
						:alt="currentQuote.author?.name ? `Photo de ${currentQuote.author.name}` : 'Photo auteur'"
					/>

					<!--
						Infos auteur :
						- Author affiche “Anonyme” si pas de nom
						- Bio n’affiche rien si la bio est absente
					-->
					<div class="card__meta">
						<Author :name="currentQuote.author?.name" />
						<Bio :text="currentQuote.author?.bio" />
					</div>
				</header>

				<!-- Texte de la citation -->
				<Citation :text="currentQuote.text" />

				<!--
					Bouton principal :
					- clique => nextQuote()
					- nextQuote change un index dans useQuotes()
					- Vue re-render automatiquement avec la nouvelle citation
				-->
				<div class="card__actions">
					<button class="btn" type="button" @click="nextQuote">Nouvelle citation</button>
				</div>

				<!--
					Partage :
					- si le navigateur supporte le partage natif => bouton “Partager”
					- sinon => liens de partage
					- on lui passe uniquement les infos utiles
				-->
				<ShareButtons :text="currentQuote.text" :author="currentQuote.author?.name" />
			</section>
		</main>
	</template>

	<style scoped lang="scss">
	/**
	 * Styles de HomeView (scoped = ça ne déborde pas ailleurs)
	 *
	 * Mobile-first :
	 * - on définit d’abord le style pour mobile
	 * - ensuite on améliore pour les écrans plus larges
	 */

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 14px;
	}

	.card {
		border-radius: 14px;
		padding: 14px;
		display: grid;
		gap: 14px;

		&__header {
			display: grid;
			grid-template-columns: 56px 1fr;
			gap: 12px;
			align-items: start;
		}

		&__meta {
			display: grid;
			gap: 6px;
		}

		&__actions {
			display: flex;
		}
	}

	/**
	 * Bouton “simple” :
	 * - pour l’instant on met un style local
	 * - plus tard, on pourra créer un composant Button si on en a plusieurs
	 */
	.btn {
		border: 1px solid #ff0000;
		background: rgba(255, 255, 255, 0.06);
		color: #000;
		border-radius: 10px;
		padding: 10px 12px;
		cursor: pointer;
	}

	@media (min-width: 640px) {
		.card {
			padding: 18px;
		}
	}
	</style>
