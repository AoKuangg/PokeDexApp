import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PokemonCard from "../components/PokemonCard";
import { usePokemonStore } from "../store/pokemonStore";
import { TEXTS } from "../utils/constants";

const FavoritesScreen = ({ navigation }) => {
  const { favorites } = usePokemonStore();

  const handlePokemonPress = (pokemon) => {
    navigation.navigate("PokemonDetail", {
      pokemonId: pokemon.id,
      pokemonName: pokemon.name,
    });
  };

  const renderPokemon = ({ item }) => (
    <PokemonCard pokemon={item} onPress={handlePokemonPress} />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={80} color="#DDD" />
      <Text style={styles.emptyTitle}>No hay favoritos</Text>
      <Text style={styles.emptyText}>{TEXTS.no_favorites}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <Text style={styles.title}>{TEXTS.favorites}</Text>
        <Text style={styles.subtitle}>
          {favorites.length} Pokémon guardados
        </Text>
      </View>

      <FlatList
        data={favorites}
        renderItem={renderPokemon}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={favorites.length > 0 ? styles.row : null}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  listContainer: {
    padding: 15,
    paddingTop: 20,
  },
  row: {
    justifyContent: "space-between",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#999",
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 40,
  },
});

export default FavoritesScreen;
