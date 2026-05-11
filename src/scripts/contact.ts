// === SELECCIÓN DE ELEMENTOS ===
const form          = document.getElementById("form-contact") as HTMLFormElement;
const btn           = document.getElementById("btn-submit")   as HTMLButtonElement;
const nameInput     = document.getElementById("name")         as HTMLInputElement;
const emailInput    = document.getElementById("email")        as HTMLInputElement;
const subjectInput  = document.getElementById("subject")      as HTMLInputElement;
const messageInput  = document.getElementById("message")      as HTMLTextAreaElement;
const errorName     = document.getElementById("error-name")    as HTMLSpanElement;
const errorEmail    = document.getElementById("error-email")   as HTMLSpanElement;
const errorSubject  = document.getElementById("error-subject") as HTMLSpanElement;
const errorMessage  = document.getElementById("error-message") as HTMLSpanElement;

// === FUNCIONES DE VALIDACIÓN ===
function validateField(id: string): string {
  if (id === "name") {
    const value = nameInput.value.trim();
    if (!value) return "El nombre completo es obligatorio.";
    if (value.length < 3) return "El nombre debe tener al menos 3 caracteres.";
  }
  if (id === "email") {
    const value = emailInput.value.trim();
    if (!value) return "El correo electrónico es obligatorio.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Ingresa un correo válido (ej. nombre@dominio.com).";
  }
  if (id === "subject") {
    const value = subjectInput.value.trim();
    if (!value) return "El asunto es obligatorio.";
    if (value.length < 5) return "El asunto debe tener al menos 5 caracteres.";
  }
  if (id === "message") {
    const value = messageInput.value.trim();
    if (!value) return "El mensaje es obligatorio.";
    if (value.length < 20) return "El mensaje debe tener al menos 20 caracteres.";
  }
  return "";
}

function isFormValid(): boolean {
  return ["name", "email", "subject", "message"].every(
    (id) => validateField(id) === ""
  );
}

// === FUNCIONES DE RENDERIZADO ===
function renderFieldError(errorEl: HTMLSpanElement, message: string): void {
  if (message) {
    errorEl.textContent = message;
    errorEl.classList.remove("hidden");
  } else {
    errorEl.textContent = "";
    errorEl.classList.add("hidden");
  }
}

function updateSubmitButton(): void {
  btn.disabled = !isFormValid();
}

function setSubmittingState(submitting: boolean): void {
  btn.disabled = submitting;
  btn.textContent = submitting ? "Enviando..." : "Enviar Mensaje";
}

// === ESCUCHADORES DE EVENTOS ===
const fieldMap: Array<{
  input: HTMLInputElement | HTMLTextAreaElement;
  errorEl: HTMLSpanElement;
  id: string;
}> = [
  { input: nameInput,    errorEl: errorName,    id: "name"    },
  { input: emailInput,   errorEl: errorEmail,   id: "email"   },
  { input: subjectInput, errorEl: errorSubject, id: "subject" },
  { input: messageInput, errorEl: errorMessage, id: "message" },
];

fieldMap.forEach(({ input, errorEl, id }) => {
  const handleValidation = () => {
    const message = validateField(id);
    renderFieldError(errorEl, message);
    updateSubmitButton();
  };
  input.addEventListener("input", handleValidation);
  input.addEventListener("blur", handleValidation);
});

async function handleSubmit(e: Event): Promise<void> {
  e.preventDefault();
  setSubmittingState(true);
  
  const info = {
    name:    nameInput.value.trim(),
    email:   emailInput.value.trim(),
    subject: subjectInput.value.trim(),
    message: messageInput.value.trim(),
  }
  
  
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(info),
  });
  
  const data = await res.json();
  
  if (res.ok) {
    alert("¡Mensaje enviado con éxito!");
    form.reset();
    updateSubmitButton();
  } else {
    alert(data.error ?? "Ocurrió un error al enviar el mensaje.");
    setSubmittingState(false);
  }


  btn.textContent = "Enviar Mensaje";
}

form.addEventListener("submit", handleSubmit);
