(() => {
  const cfg = window.ELEMENTAL_CONFIG || {};
  const configured =
    cfg.supabaseUrl &&
    cfg.supabaseAnonKey &&
    !cfg.supabaseUrl.includes("PASTE_") &&
    !cfg.supabaseAnonKey.includes("PASTE_");

  let client = null;

  if (configured && window.supabase) {
    client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
  }

  const el = (id) => document.getElementById(id);
  const modal = el("authModal");
  const loginView = el("loginView");
  const registerView = el("registerView");
  const message = el("authMessage");

  function showMessage(text, type = "") {
    message.textContent = text;
    message.className = `message ${type}`.trim();
  }

  function clearMessage() {
    message.textContent = "";
    message.className = "message hidden";
  }

  function openModal(mode = "login") {
    clearMessage();
    modal.classList.remove("hidden");
    showMode(mode);
  }

  function closeModal() {
    modal.classList.add("hidden");
    clearMessage();
  }

  function showMode(mode) {
    loginView.classList.toggle("hidden", mode !== "login");
    registerView.classList.toggle("hidden", mode !== "register");
  }

  async function renderSession(session) {
    const loggedIn = !!session?.user;
    el("openLoginBtn").classList.toggle("hidden", loggedIn);
    el("openRegisterBtn").classList.toggle("hidden", loggedIn);
    el("accountBtn").classList.toggle("hidden", !loggedIn);
    el("logoutBtn").classList.toggle("hidden", !loggedIn);
    el("accountPanel").classList.toggle("hidden", !loggedIn);

    const status = el("authStatus");

    if (!loggedIn) {
      status.textContent = configured
        ? "Nu ești autentificat."
        : "Auth nu este configurat încă. Completează config.js.";
      status.classList.remove("ok");
      return;
    }

    const user = session.user;
    const username =
      user.user_metadata?.username ||
      user.email?.split("@")[0] ||
      "Player";

    el("profileName").textContent = username;
    el("profileEmail").textContent = user.email || "—";
    el("profileStatus").textContent = user.email_confirmed_at ? "Verified" : "Active";
    status.textContent = `Autentificat ca ${username}`;
    status.classList.add("ok");
  }

  async function init() {
    if (!client) {
      await renderSession(null);
      return;
    }

    const { data } = await client.auth.getSession();
    await renderSession(data.session);

    client.auth.onAuthStateChange((_event, session) => {
      renderSession(session);
    });
  }

  el("openLoginBtn").addEventListener("click", () => openModal("login"));
  el("openRegisterBtn").addEventListener("click", () => openModal("register"));
  el("heroAccountBtn").addEventListener("click", async () => {
    if (!client) {
      openModal("register");
      showMessage("Mai întâi completează Supabase Project URL și anon key în config.js.", "error");
      return;
    }

    const { data } = await client.auth.getSession();
    if (data.session) {
      document.getElementById("accountPanel").scrollIntoView({ behavior: "smooth" });
    } else {
      openModal("register");
    }
  });

  el("accountBtn").addEventListener("click", () => {
    document.getElementById("accountPanel").scrollIntoView({ behavior: "smooth" });
  });

  el("closeModalBtn").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  el("switchToRegister").addEventListener("click", () => showMode("register"));
  el("switchToLogin").addEventListener("click", () => showMode("login"));

  el("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!client) {
      showMessage("Supabase nu este configurat. Completează config.js.", "error");
      return;
    }

    const username = el("registerUsername").value.trim();
    const email = el("registerEmail").value.trim();
    const password = el("registerPassword").value;

    showMessage("Creez contul...");

    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    });

    if (error) {
      showMessage(error.message, "error");
      return;
    }

    if (data.session) {
      showMessage("Cont creat și autentificat.", "success");
      setTimeout(closeModal, 800);
    } else {
      showMessage(
        "Cont creat. Verifică emailul pentru confirmare, apoi fă Login.",
        "success"
      );
    }
  });

  el("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!client) {
      showMessage("Supabase nu este configurat. Completează config.js.", "error");
      return;
    }

    const email = el("loginEmail").value.trim();
    const password = el("loginPassword").value;

    showMessage("Login...");

    const { error } = await client.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      showMessage(error.message, "error");
      return;
    }

    showMessage("Login reușit.", "success");
    setTimeout(closeModal, 500);
  });

  el("logoutBtn").addEventListener("click", async () => {
    if (client) {
      await client.auth.signOut();
    }
  });

  init();
})();
