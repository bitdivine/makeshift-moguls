import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Int "mo:core/Int";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  type Player = {
    name : Text;
    score : Nat;
  };

  let players = Map.empty<Text, Player>();

  public query ({ caller }) func getPlayer(name : Text) : async Player {
    switch (players.get(name)) {
      case (null) { Runtime.trap("Player not found") };
      case (?player) { player };
    };
  };

  public query ({ caller }) func getAllPlayers() : async [Player] {
    let iter = players.values();
    iter.toArray();
  };

  public shared ({ caller }) func createPlayer(name : Text) : async () {
    if (players.containsKey(name)) {
      Runtime.trap("Player already exists");
    };
    let newPlayer = {
      name;
      score = 0;
    };
    players.add(name, newPlayer);
  };

  public shared ({ caller }) func updateScore(name : Text, scoreChange : Int) : async () {
    switch (players.get(name)) {
      case (null) { Runtime.trap("Player not found") };
      case (?player) {
        let newScore = if (scoreChange < 0 and player.score < Int.abs(scoreChange)) {
          0;
        } else {
          let intScore : Int = player.score + scoreChange;
          if (intScore < 0) { 0 } else { intScore.toNat() };
        };
        let updatedPlayer = {
          player with
          score = newScore;
        };
        players.add(name, updatedPlayer);
      };
    };
  };
};
