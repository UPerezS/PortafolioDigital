$(document).ready(function () {

	/*  Show/Hidden Nav Lateral */
	$('.show-nav-lateral').on('click', function (e) {
		e.preventDefault();
		var NavLateral = $('.nav-lateral');
		var PageContent = $('.page-content');

		NavLateral.toggleClass('active');
		// On mobile, we might want to toggle a class on body to prevent scrolling when menu is open
	});

	/* Theme Toggle Logic */
	const toggleBtn = document.getElementById('theme-toggle');
	const toggleIcon = toggleBtn.querySelector('i');

	// Function to set theme
	function setTheme(isLight) {
		if (isLight) {
			document.body.setAttribute('data-theme', 'light');
			toggleIcon.classList.remove('fa-moon');
			toggleIcon.classList.add('fa-sun');
			localStorage.setItem('theme', 'light');
		} else {
			document.body.removeAttribute('data-theme');
			toggleIcon.classList.remove('fa-sun');
			toggleIcon.classList.add('fa-moon');
			localStorage.setItem('theme', 'dark');
		}
	}

	// 1. Check LocalStorage
	const savedTheme = localStorage.getItem('theme');

	if (savedTheme) {
		setTheme(savedTheme === 'light');
	} else {
		// 2. Check System Preference
		const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
		setTheme(systemPrefersLight);
	}

	// Toggle Button Click
	toggleBtn.addEventListener('click', function () {
		const isCurrentlyLight = document.body.getAttribute('data-theme') === 'light';
		setTheme(!isCurrentlyLight);
	});

	// Optional: Listen for system changes if no override is set?
	// For now, manual toggle saves preference, so it effectively overrides system.

	/* Smooth Scroll for Nav Links */
	$('.nav-lateral-menu a').on('click', function (e) {
		// If it's an anchor link
		if (this.hash !== "") {
			e.preventDefault();
			var hash = this.hash;

			$('html, body').animate({
				scrollTop: $(hash).offset().top
			}, 800, function () {
				window.location.hash = hash;
			});

			// Close mobile menu if open
			$('.nav-lateral').removeClass('active');
		}
	});

	/* Scroll To Top Logic */
	var scrollTopBtn = $('#scrollTopBtn');

	$(window).scroll(function () {
		if ($(window).scrollTop() > 300) {
			scrollTopBtn.fadeIn();
		} else {
			scrollTopBtn.fadeOut();
		}
	});

	scrollTopBtn.on('click', function (e) {
		e.preventDefault();
		$('html, body').animate({ scrollTop: 0 }, '300');
	});

	/* =========================================
	   CURSOR TRAIL ANIMATION
	   ========================================= */
	const canvas = document.getElementById('cursor-canvas');
	if (canvas) {
		const ctx = canvas.getContext('2d');
		let width, height;
		let particles = [];

		// Resize canvas
		function resizeCanvas() {
			width = window.innerWidth;
			height = window.innerHeight;
			canvas.width = width;
			canvas.height = height;
		}
		window.addEventListener('resize', resizeCanvas);
		resizeCanvas();

		// Get color from CSS variable
		function getAccentColor() {
			const style = getComputedStyle(document.body);
			return style.getPropertyValue('--primary-accent').trim();
		}

		// Particle Class
		class Particle {
			constructor(x, y) {
				this.x = x;
				this.y = y;
				this.size = Math.random() * 5 + 1; // Random size
				this.speedX = Math.random() * 2 - 1;
				this.speedY = Math.random() * 2 - 1;
				this.color = getAccentColor();
				this.life = 1.0; // Opacity/Life
			}
			update() {
				this.x += this.speedX;
				this.y += this.speedY;
				if (this.size > 0.2) this.size -= 0.1;
				this.life -= 0.02;
			}
			draw() {
				ctx.fillStyle = this.color;
				ctx.globalAlpha = this.life;
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
				ctx.fill();
				ctx.globalAlpha = 1.0; // Reset
			}
		}

		// Track Mouse
		let mouse = { x: null, y: null };
		window.addEventListener('mousemove', function (e) {
			mouse.x = e.clientX;
			mouse.y = e.clientY;
			// Add particles on move
			for (let i = 0; i < 2; i++) {
				particles.push(new Particle(mouse.x, mouse.y));
			}
		});

		// Animation Loop
		function animateParticles() {
			ctx.clearRect(0, 0, width, height);

			for (let i = 0; i < particles.length; i++) {
				particles[i].update();
				particles[i].draw();

				// Remove dead particles
				if (particles[i].life <= 0 || particles[i].size <= 0.2) {
					particles.splice(i, 1);
					i--;
				}
			}
			requestAnimationFrame(animateParticles);
		}
		animateParticles();
	}

});

function copyEmail() {
	// Fallback if input not present or hidden
	const emailText = "cu40883@gmail.com";

	navigator.clipboard.writeText(emailText).then(() => {
		const Toast = Swal.mixin({
			toast: true,
			position: 'top-end',
			showConfirmButton: false,
			timer: 3000,
			timerProgressBar: true,
			didOpen: (toast) => {
				toast.addEventListener('mouseenter', Swal.stopTimer)
				toast.addEventListener('mouseleave', Swal.resumeTimer)
			}
		});

		Toast.fire({
			icon: 'success',
			title: 'Correo copiado'
		});
	}).catch(() => {
		Swal.fire({
			icon: 'error',
			title: 'Error',
			text: 'No se pudo copiar el correo'
		});
	});
}
