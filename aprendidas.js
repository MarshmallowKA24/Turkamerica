// Función para actualizar el estado del deck de aprendidas
function updateLearnedDeckUI() {
    const learnedDeck = decks.find(d => d.isLearnedDeck);
    if (!learnedDeck) return;

    document.getElementById('learned-count').textContent = learnedDeck.cards.length;
    document.getElementById('learned-cards-count').textContent = learnedDeck.cards.length;
    document.getElementById('learned-name').textContent = learnedDeck.name;
    document.getElementById('learned-description').textContent = learnedDeck.description;
}

// Eliminar el deck de aprendidas completamente
function deleteLearnedDeck() {
    const learnedDeck = decks.find(d => d.isLearnedDeck);
    if (!learnedDeck) return;

    if (confirm(`¿Seguro que quieres eliminar el deck de aprendidas "${learnedDeck.name}"? Las tarjetas se moverán de vuelta a su deck original.`)) {
        // Mover todas las tarjetas de vuelta a sus decks originales
        learnedDeck.cards.forEach(card => {
            let originalDeck = decks.find(d => String(d.id) === String(card.sourceDeckId));
            if (!originalDeck) {
                originalDeck = {
                    id: generateUniqueId(),
                    name: card.sourceDeck || 'Deck Restaurado',
                    description: 'Deck restaurado automáticamente',
                    category: 'Restaurado',
                    cards: [],
                    created: new Date().toISOString()
                };
                decks.push(originalDeck);
            }
            // Resetear el estado de la tarjeta
            card.learned = false;
            delete card.learnedAt;
            delete card.sourceDeck;
            delete card.sourceDeckId;
            // Mover la tarjeta de vuelta
            originalDeck.cards.push(card);
        });
        // Eliminar el deck de aprendidas
        decks = decks.filter(d => !d.isLearnedDeck);
        saveDecks();
        updateDecksDisplay();
        updateLearnedDeckUI();
        console.log(`Deck de aprendidas "${learnedDeck.name}" eliminado y tarjetas restauradas`);
    }
}