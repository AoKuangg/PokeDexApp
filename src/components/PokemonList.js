import React from "react";
import { FlatList, View, Text, StyleSheet, RefreshControl } from "react-native";
import PokemonCard from "./PokemonCard";
import LoadingSpinner from "./LoadingSpinner";
import { usePokemonStore } from "../store/pokemonStore";
import { TEXTS } from "../utils/constants";

const PokemonList = ({ onPokemonPress }) => {
  const {
    filteredPokemonList,
    loading,
    fetchPokemonList,
    fetchMorePokemon,
    hasMore,
    searchQuery,
    selectedTypes,
  } = usePokemonStore();

  const renderPokemon = ({ item }) => (
    <PokemonCard pokemon={item} onPress={onPokemonPress} />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{TEXTS.no_results}</Text>
    </View>
  );

  if (loading && filteredPokemonList.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <FlatList
      data={filteredPokemonList}
      renderItem={renderPokemon}
      keyExtractor={(item, index) =>
        item?.id ? item.id.toString() : `pokemon-${index}`
      }
      numColumns={2}
      contentContainerStyle={styles.container}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={renderEmpty}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={() => fetchPokemonList(true)}
          colors={["#007AFF"]}
        />
      }
      onEndReached={() => {
        if (
          hasMore &&
          !loading &&
          !searchQuery.trim() &&
          selectedTypes.length === 0
        ) {
          fetchMorePokemon();
        }
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loading && filteredPokemonList.length > 0 ? <LoadingSpinner /> : null
      }
      maintainVisibleContentPosition={{
        minIndexForVisible: 0,
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingTop: 5,
  },
  row: {
    justifyContent: "space-between",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default PokemonList;
