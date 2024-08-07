
class Calculadora{

    historial = [];
    operando_derecho = "";
    operando_izquierdo = "";
    operador = "";
    pantalla = document.querySelector(".pantalla");
    pantalla_superior = document.querySelector(".pantalla_superior");
    pantalla_inferior = document.querySelector(".pantalla_inferior");
    pantalla_historial = document.querySelector(".historial");


    constructor(){
        this.eventos();
    }


    eventos(){

        document.querySelectorAll(".boton_numerico").forEach(boton => {
            boton.addEventListener("click", (e) => {
                this.agregarNumero(e);
            })
        })

        document.querySelectorAll(".boton_operacion").forEach(boton => {
            boton.addEventListener("click", (e) => {
                this.agregarOperacion(e);
            })
        })

        document.querySelectorAll(".boton_control").forEach(boton => {
            boton.addEventListener("click", (e) => {
                this.controlOperacion(e);
            })
        })

        document.getElementById("boton_historial").addEventListener("click", (e) => {
            this.mostrarHistorial();
        })

    }

    agregarNumero(e){

        let elemento = e.target.innerText;

        if(!this.operador){
            if(elemento == "." && this.operando_izquierdo.includes(".")) return;
            this.operando_izquierdo += elemento;
        }else{
            if(elemento == "." && this.operando_derecho.includes(".")) return;
            this.operando_derecho += elemento;
        }

        this.imprimir()

    }

    agregarOperacion(e){

        if(!this.operando_izquierdo) return;

       
        if(this.operador && this.operando_derecho){
            this.resultado();
        }

        this.operador = e.target.innerText;

        this.imprimir()
    }

    controlOperacion(e){

        let accion = e.target.innerText;

        switch (accion) {
            case "AC":

                this.operando_izquierdo = "";
                this.operando_derecho = "";
                this.operador = "";
                this.historial = [];
                this.imprimir();
                
                break;

            case "<":

                if(this.operando_derecho){
                    this.operando_derecho = this.operando_derecho.slice(0, -1).toString();
                }else if(this.operador){
                    this.operador = "";
                }else {
                    this.operando_izquierdo = this.operando_izquierdo.slice(0, -1).toString();
                }

                this.imprimir();

                break;

            case "+/-":

                if(this.operador){
                    this.operando_derecho = (this.operando_derecho * -1).toString();
                }else{
                    this.operando_izquierdo = (this.operando_izquierdo * -1).toString();
                }

                this.imprimir();
                break;

            case "%": 
                if(this.operador){
                    this.operando_derecho += "%";
                }else{
                    this.operando_izquierdo += "%";
                }
                this.imprimir();
                break;

            case "=":
                this.resultado();
                break;

        
            default:
                break;
        }

    }


    imprimir(){

        this.pantalla_superior.innerHTML = `${this.formatoNumero(this.operando_izquierdo)}<span class="color-azul">${this.operador}</span>${this.formatoNumero(this.operando_derecho)}`;

        if(this.operador || this.operando_izquierdo.includes("%")){
            let resultado = this.calcular();
            if(resultado){
                this.pantalla_inferior.innerHTML = this.formatoNumero(resultado)
            }
        }else{
            this.pantalla_inferior.innerHTML = "";
        }

    }

    calcular(){
        let operacion = `${this.operando_izquierdo}${this.operador}${this.operando_derecho}`;

        operacion = operacion.replace("%", "/100");
        operacion = operacion.replace("x", "*");
        operacion = operacion.replace("÷", "/");

        try {
            return eval(operacion)
        } catch (error) {
            return null
        }

    }

    resultado(){
        let resultado = this.calcular();


        if(resultado == null){
            this.imprimir()
            return
        }

        this.historial.push({
            operacion: `${this.operando_izquierdo}${this.operador}${this.operando_derecho}`,
            resultado: resultado
        })

        this.operando_izquierdo = resultado.toString();
        this.operando_derecho = "";
        this.operador = "";

        this.imprimir();

    }

    formatoNumero(x){
        var partes = x.toString().split(".");
        partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return partes.join(".");
    }

    mostrarHistorial(){
        this.pantalla_historial.classList.toggle("activo");

        this.pantalla_historial.innerHTML = "";

        this.historial.forEach((element, index)=>{

            this.pantalla_historial.innerHTML += `
                <div class="historial_operacion">
                    <div class="operacion">${element.operacion}</div>
                    <div class="resultado">${this.formatoNumero(element.resultado)}</div>
                </div>
            `

        })

    }



}

const calculadora = new Calculadora();