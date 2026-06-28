const CART_TARGET_SELECTOR = "[data-cart-target]";
const PRODUCT_IMAGE_SELECTOR = "[data-product-image], img";

const isInViewport = (rect) =>
  rect.bottom > 0 &&
  rect.right > 0 &&
  rect.top < window.innerHeight &&
  rect.left < window.innerWidth;

const getVisibleCartTarget = () => {
  if (typeof document === "undefined") return null;

  const targets = Array.from(document.querySelectorAll(CART_TARGET_SELECTOR));

  return (
    targets.find((target) => {
      const rect = target.getBoundingClientRect();
      const style = window.getComputedStyle(target);

      return (
        rect.width > 0 &&
        rect.height > 0 &&
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        isInViewport(rect)
      );
    }) || null
  );
};

const getSourceImage = (sourceElement) => {
  if (!sourceElement) return null;

  if (sourceElement.matches?.(PRODUCT_IMAGE_SELECTOR)) {
    return sourceElement;
  }

  const productCard = sourceElement.closest?.("[data-product-card]");

  return (
    sourceElement.querySelector?.(PRODUCT_IMAGE_SELECTOR) ||
    productCard?.querySelector?.(PRODUCT_IMAGE_SELECTOR) ||
    null
  );
};

const getRectCenter = (rect) => ({
  x: rect.left + rect.width / 2,
  y: rect.top + rect.height / 2,
});

const getFallbackCartCenter = () => ({
  x: Math.max(44, window.innerWidth - 56),
  y: 56,
});

export const pulseCartTarget = () => {
  const target = getVisibleCartTarget();
  if (!target) return;

  target.classList.remove("cart-drop-pulse");
  void target.offsetWidth;
  target.classList.add("cart-drop-pulse");

  window.setTimeout(() => target.classList.remove("cart-drop-pulse"), 520);
};

export const flyProductToCart = (sourceElement) =>
  new Promise((resolve) => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      resolve();
      return;
    }

    const sourceImage = getSourceImage(sourceElement);
    const cartTarget = getVisibleCartTarget();

    if (!sourceImage) {
      resolve();
      return;
    }

    const from = sourceImage.getBoundingClientRect();
    const to = cartTarget?.getBoundingClientRect();

    if (!from.width || !from.height) {
      resolve();
      return;
    }

    const start = getRectCenter(from);
    const end = to?.width && to?.height ? getRectCenter(to) : getFallbackCartCenter();
    const size = Math.min(132, Math.max(76, Math.min(from.width, from.height) * 0.92));
    const ghost = document.createElement("div");
    const img = document.createElement("img");
    const badge = document.createElement("span");

    img.src = sourceImage.currentSrc || sourceImage.src;
    img.alt = "";
    badge.textContent = "+1";
    ghost.className = "fly-to-cart-item";
    img.className = "fly-to-cart-item__image";
    badge.className = "fly-to-cart-item__badge";

    ghost.style.left = `${start.x}px`;
    ghost.style.top = `${start.y}px`;
    ghost.style.width = `${size}px`;
    ghost.style.height = `${size}px`;

    ghost.appendChild(img);
    ghost.appendChild(badge);
    document.body.appendChild(ghost);

    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const arcHeight = Math.min(190, Math.max(95, Math.abs(deltaX) * 0.18));
    const duration = 1120;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      ghost.remove();
      resolve();
    };

    const keyframes = [
      {
        transform: "translate(-50%, -50%) translate3d(0, 0, 0) scale(1)",
        opacity: 1,
        offset: 0,
      },
      {
        transform: `translate(-50%, -50%) translate3d(${deltaX * 0.38}px, ${
          deltaY * 0.18 - arcHeight
        }px, 0) scale(1.12) rotate(-8deg)`,
        opacity: 1,
        offset: 0.38,
      },
      {
        transform: `translate(-50%, -50%) translate3d(${deltaX * 0.78}px, ${
          deltaY * 0.72 - arcHeight * 0.42
        }px, 0) scale(0.76) rotate(7deg)`,
        opacity: 0.94,
        offset: 0.78,
      },
      {
        transform: `translate(-50%, -50%) translate3d(${deltaX}px, ${deltaY}px, 0) scale(0.34) rotate(0deg)`,
        opacity: 0.28,
        offset: 1,
      },
    ];

    if (ghost.animate) {
      const animation = ghost.animate(keyframes, {
        duration,
        easing: "cubic-bezier(0.2, 0.85, 0.2, 1)",
        fill: "forwards",
      });

      animation.addEventListener("finish", finish, { once: true });
      animation.addEventListener("cancel", finish, { once: true });
    } else {
      ghost.style.transition = `transform ${duration}ms cubic-bezier(0.2, 0.85, 0.2, 1), opacity ${duration}ms ease`;
      window.requestAnimationFrame(() => {
        ghost.style.transform = `translate(-50%, -50%) translate3d(${deltaX}px, ${deltaY}px, 0) scale(0.34)`;
        ghost.style.opacity = "0.28";
      });
      ghost.addEventListener("transitionend", finish, { once: true });
    }

    window.setTimeout(finish, duration + 160);
  });
