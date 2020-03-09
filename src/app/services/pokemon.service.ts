import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {map} from 'rxjs/operators'
import { Storage } from '@ionic/storage';

@Injectable({
    providedIn: 'root'
})

export class PokemonService{
    baseURL = "https://pokeapi.co/api/v2"
    imageURL= "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"
    fullImageURL="https://img.pokemondb.net/artwork/"
    addedPokemon=[]
    constructor(private http: HttpClient, private storage: Storage){
        storage.get('addedPokemon').then((val) => {
            if(val !== null){
                this.addedPokemon = val
            }
        });
    }

    getPokemon(offset = 0){
        let httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }),
          };          
        return this.http.get(`${this.baseURL}/pokemon?offset=${offset}&limit=25`, httpOptions).pipe(
            map(result=>{
                return result['results']
            }),
            map(pokemons=>{
                 return pokemons.map((pokemon,index) =>{
                    pokemon.image= this.getPokemonImage(index + offset + 1)
                    pokemon.pokeIndex = index + offset + 1;
                    return pokemon;
                })
            })
        )
    }

    getPokemonImage(index){
        return `${this.imageURL}${index}.png`
    }

    getFullPokemonImage(name){
        return `${this.fullImageURL}${name}.jpg`
    }

    getSinglePokemon(id){
        let httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }),
        }
        return this.http.get(`${this.baseURL}/pokemon/${id}`, httpOptions);
    }

    getSingleAddedPokemon(id){
       for(let i =0; i< this.addedPokemon.length; i++){
           if(this.addedPokemon[i].id === id){
               return this.addedPokemon[i]
           }
       }

       return {}
    }

    getTypes(){
        let httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }),
        }
        return this.http.get(`${this.baseURL}/type`, httpOptions);
    }

    savePokemon(pokemon){
        this.addedPokemon.push(this.parsePokemonToApiFormat(pokemon))
        this.storage.set('addedPokemon', this.addedPokemon)
    }

    deletePokemon(id){
        for(let i =0; i< this.addedPokemon.length; i++){
            if(this.addedPokemon[i].id === id){
                this.addedPokemon = this.addedPokemon.slice(i+1,1);
                this.storage.set('addedPokemon', this.addedPokemon)
            }
        }
    }

    getAddedPokemon(){
        return this.addedPokemon;
    }

    updatePokemon(pokemon){
        for(let i =0; i< this.addedPokemon.length; i++){
            if(this.addedPokemon[i].id === pokemon.id){
                this.addedPokemon[i] = this.parsePokemonToApiFormat(pokemon)
                this.storage.set('addedPokemon', this.addedPokemon)
            }
        }
    }

    private parsePokemonToApiFormat(pokemon){
        pokemon.pokeIndex = 965 + this.addedPokemon.length;
        pokemon.id = 965 + this.addedPokemon.length;
        pokemon.types[0].type.name = pokemon.type1;
        if(pokemon.type2){
            pokemon.types[1] = {type:{}};
            pokemon.types[1].type.name = pokemon.type2;
        }
        pokemon.weight = pokemon.weight * 10;
        pokemon.height = pokemon.height * 10;
        return pokemon
    }
}