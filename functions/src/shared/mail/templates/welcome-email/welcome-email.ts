import { IEmailTemplate } from "../i-email-template";
import { IWelcomeEmailData } from "./i-welcome-email-data";

export class WelcomeEmail implements IEmailTemplate<IWelcomeEmailData>{

    public constructor(
        public readonly data: IWelcomeEmailData
    ) { }

    public html(): string {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bienvenida</title>
            <style>
                body{
                    background-color: #ffffff;
                    text-align: justify;
                    
                    
                }
                #contenedor{
                    background-position: center;
                    background-size: 100% 100%;
                    background-repeat: no-repeat;
                    width: 800px;
                    height: 1000px;
                    background-image: url(BIENVENIDA-04v2.png);
                    background-image: url(https://github.com/dani117m/notificaciones/blob/main/notificaciones/BIENVENIDA.png?raw=true);
                    margin: 0  auto;
                    padding: 0;
                }
        
            </style>
        </head>
        <body> 
            <div id="contenedor" style="color: #0c3a5a; font-size: 21px; font-family: Arial;">
                <br><br><br><br><br><br><br>
                <br><br><br><br><br><br><br>
                <br><br><br><br>
                <P>
                    <blockquote>
                    Desde el equipo de <b>Proyecto Mentores</b>, 
                    te damos la bienvenida al nuevo <b>Sistema de Acompañamiento
                    Mentorial</b>, al acceso es solo para usuarios <b>UTPL</b>, y tus roles
                    seran asignados automáticamente.
                    <br><br>
                    Accede al sistema e inicia tu acompañamiento a través del siguien en enlace:
                    <br><br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <a
                        style="background-color:transparent; border-color:transparent; border-radius:6px;
                         border-width:1px;  display:flexbox; padding:25px 300px 10px 5px; text-align:center;
                         text-decoration:none; border-style: inherit;"
                        href="${this.data.redirectUrl}">
                        
                    </a>
                    
                    <br><br><br><br><br><br><br>
                    La infirmación de este correo ha dio generada automáticamente por el 
                    <b>Sistema de Gestión del Proyecto Mentores</b>.
                    <br><br><br>
                    <br><br>
                    <div id="correo" style="color: #ffffff; text-align: right; font-size: 18px;">
                        Si tienes dudas o requieres mayor información, contáctate con <br>bigomez@utpl.edu.ec
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </div>
                    </blockquote> 
                </P>
            </div> 
        </body>
        </html>
            `
    }
}