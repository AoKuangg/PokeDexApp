import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { usePokemonStore } from "../store/pokemonStore";
import { TYPE_COLORS, TEXTS } from "../utils/constants";

const TypeFilter = () => {
  const {
    pokemonTypes,
    selectedTypes,
    toggleTypeFilter,
    fetchPokemonTypes,
    clearFilters,
  } = usePokemonStore();

  useEffect(() => {
    if (pokemonTypes.length === 0) {
      fetchPokemonTypes();
    }
  }, []);

  const filteredTypes = pokemonTypes.filter(
    (type) => !["unknown", "shadow"].includes(type.name)
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{TEXTS.filter_by_type}</Text>
        {selectedTypes.length > 0 && (
          <TouchableOpacity onPress={clearFilters} style={styles.clearButton}>
            <Text style={styles.clearText}>{TEXTS.clear_filters}</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {filteredTypes.map((type) => {
          const isSelected = selectedTypes.includes(type.name);
          const backgroundColor = isSelected
            ? TYPE_COLORS[type.name] || "#68A090"
            : "#F0F0F0";
          const textColor = isSelected ? "#FFF" : "#333";

          return (
            <TouchableOpacity
              key={type.name}
              style={[styles.typeButton, { backgroundColor }]}
              onPress={() => toggleTypeFilter(type.name)}
            >
              <Text style={[styles.typeText, { color: textColor }]}>
                {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    paddingVertical: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  clearButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  clearText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "500",
  },
  scrollContainer: {
    paddingHorizontal: 15,
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 0,
  },
  typeText: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export default TypeFilter;
