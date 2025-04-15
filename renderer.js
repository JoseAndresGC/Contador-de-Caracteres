document.addEventListener('DOMContentLoaded', function() {
    const charCountSpan = document.getElementsByClassName("charCountSpan")[0];
    const wordCountSpan = document.getElementsByClassName("wordCountSpan")[0];
    const sentenceCountSpan = document.getElementsByClassName("sentenceCountSpan")[0];
    const clearButton = document.getElementsByClassName("clear-button")[0];
    const inputText = document.getElementsByClassName("input-text")[0];
    
    function updateCounts() {
    const text = inputText.value; // obtener el valor del textarea
    const charCount = text.length; // contar caracteres
    const wordCount = text.trim().split(/\s+/).length; // contar palabras
    const sentences = text.split(/[.?!]+/).filter(sentence => sentence.trim() !== '').length;

    charCountSpan.children[0].textContent = charCount; // actualizar contador de caracteres
    wordCountSpan.children[0].textContent = wordCount; // actualizar contador de palabras
    sentenceCountSpan.children[0].textContent = sentences; // actualizar contador de oraciones
    }

    inputText.addEventListener('input', updateCounts); // actualizar conteo al escribir en el textarea
    clearButton.addEventListener('click', function() {
        inputText.value = ''; // limpiar el textarea
        charCountSpan.children[0].textContent = 0; // reiniciar contador de caracteres
        wordCountSpan.children[0].textContent = 0; // reiniciar contador de palabras
        sentenceCountSpan.children[0].textContent = 0; // reiniciar contador de oraciones
    });

    // Inicializar conteos al cargar la página
    updateCounts();
});