import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {map} from 'rxjs/operators'

@Injectable({
    providedIn: 'root'
})

export class PokemonService{
    baseURL = "https://pokeapi.co/api/v2"
    imageURL= "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"
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

    getSinglePokemon(id){
        let httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }),
        }
        return this.http.get(`${this.baseURL}/pokemon/${id}`, httpOptions);
    }
}