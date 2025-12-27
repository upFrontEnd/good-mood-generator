<script setup lang="ts">
	import { onMounted, ref, watch } from "vue";

	/**
	 * ThemeToggle
	 *
	 * Rôle :
	 * - UI (toggle) inspirée du CodePen : checkbox + label + “thumb” animé
	 * - Applique le thème via l'attribut data-theme sur <html>
	 *
	 * Décision clé :
	 * - On pilote <html data-theme="light|dark"> car ton SCSS écoute [data-theme='...'].
	 */

	const STORAGE_KEY = "good-mood.theme";

	const isDark = ref(false);

	/** Applique le thème au document (source de vérité : <html data-theme="...">) */
	function applyTheme(dark: boolean) {
		const theme = dark ? "dark" : "light";
		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem(STORAGE_KEY, theme);
	}

	onMounted(() => {
		// 1) Priorité au choix utilisateur si déjà enregistré
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved === "dark" || saved === "light") {
			isDark.value = saved === "dark";
		} else {
			// 2) Sinon, on respecte la préférence OS (si dispo)
			isDark.value =
				typeof window !== "undefined" &&
				typeof window.matchMedia === "function" &&
				window.matchMedia("(prefers-color-scheme: dark)").matches;
		}

		applyTheme(isDark.value);
	});

	// Quand l'utilisateur toggle, on applique et on persiste
	watch(isDark, (v) => applyTheme(v));
	</script>

	<template>
		<div class="toggle">
			<input
				id="theme-toggle"
				v-model="isDark"
				class="toggle__input"
				type="checkbox"
				role="switch"
				:aria-checked="isDark"
				aria-label="Basculer le thème"
			/>

			<label class="toggle__label" for="theme-toggle">
				<span class="toggle__icons" aria-hidden="true">
					<span class="toggle__sun">☀</span>
					<span class="toggle__moon">🌙</span>
				</span>

				<span class="toggle__thumb" aria-hidden="true"></span>
			</label>
		</div>
	</template>

	<style scoped lang="scss">
	.toggle {
		display: inline-flex;
		align-items: center;

		&__input {
			// Cache le checkbox natif mais garde l’accessibilité
			position: absolute;
			opacity: 0;
			width: 1px;
			height: 1px;
		}

		&__label {
			position: relative;
			width: 54px;
			height: 30px;
			border-radius: 999px;
			border: 1px solid rgba(255, 255, 255, 0.18);
			background: rgba(255, 255, 255, 0.08);
			cursor: pointer;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			user-select: none;
		}

		&__icons {
			position: absolute;
			inset: 0;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 8px;
			font-size: 12px;
			opacity: 0.9;
		}

		&__thumb {
			position: absolute;
			left: 4px;
			top: 50%;
			transform: translateY(-50%);
			width: 22px;
			height: 22px;
			border-radius: 999px;
			background: rgba(255, 255, 255, 0.95);
			transition: transform 180ms ease;
		}

		// Quand checked => on translate la bille à droite
		&__input:checked + &__label &__thumb {
			transform: translate(24px, -50%);
		}

		// Focus clavier (accessibilité)
		&__input:focus-visible + &__label {
			outline: 2px solid rgba(255, 255, 255, 0.35);
			outline-offset: 2px;
		}
	}
	</style>
