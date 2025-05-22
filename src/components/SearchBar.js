import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePokemonStore } from "../store/pokemonStore";
import { TEXTS, APP_CONFIG } from "../utils/constants";

const SearchBar = () => {
  const { searchQuery, searchPokemon, clearFilters } = usePokemonStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchPokemon(localQuery);
    }, APP_CONFIG.SEARCH_DEBOUNCE);

    return () => clearTimeout(timeoutId);
  }, [localQuery]);

  const handleClear = () => {
    setLocalQuery("");
    clearFilters();
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#999"
          style={styles.searchIcon}
        />

        <TextInput
          style={styles.input}
          placeholder={TEXTS.search_placeholder}
          value={localQuery}
          onChangeText={setLocalQuery}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />

        {localQuery.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 45,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  clearButton: {
    marginLeft: 10,
  },
});

export default SearchBar;
