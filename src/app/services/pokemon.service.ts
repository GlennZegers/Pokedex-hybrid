import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {map} from 'rxjs/operators'

@Injectable({
    providedIn: 'root'
})

export class PokemonService{
    baseURL = "https://pokeapi.co/api/v2"
    imageURL= "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"
    fullImageURL="https://img.pokemondb.net/artwork/"
    addedPokemon=[]
    constructor(private http: HttpClient){
        
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
        console.log(id)
       for(let i =0; i< this.addedPokemon.length; i++){
           if(this.addedPokemon[i].id === id){
               console.log("service:", this.addedPokemon[i])
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
    }

    getAddedPokemon(){
        return this.addedPokemon;
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