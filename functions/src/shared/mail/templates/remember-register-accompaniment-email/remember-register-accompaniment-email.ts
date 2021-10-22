import { IEmailTemplate } from "../i-email-template";
import { IRememberRegisterAccompanimentEmailData } from "./i-remember-register-accompaniment-email-data";

export class RememberRegisterAccompanimentEmail implements IEmailTemplate<IRememberRegisterAccompanimentEmailData> {

    public constructor(
        public readonly data: IRememberRegisterAccompanimentEmailData,
    ) { }

    public html(): string {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Notificacion Mentores</title>
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
                    /*background-image: url(NOTIFICACION\ A\ MENTORES-06v2.png);*/
                    background-image: url(https://github.com/dani117m/notificaciones/blob/main/notificaciones/NOTIFICACION%20A%20MENTORES.png?raw=true);
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
                    <b>Hola, ${this.data.mentorName}</b>
                    <br><br><br>
                    Te recordamos que tu último acompañamiento registrado fue el 
                    <span>${this.data.lastAccompanimentDate.getDate()}</span>/<span>${this.data.lastAccompanimentDate.getMonth()}</span>/<span>${this.data.lastAccompanimentDate.getFullYear()}</span>.
                    <br><br>
                    El apoyo que brindas es muy importante, te motivamos a seguir en contacto
                    permanente con tus mentorizados, brindandoles un ambiente de amistad y estimulo,
                    carga tus acompañamientos realizados a través del siguiente <b>enlace:</b>
                    <br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <a
                        style="background-color:transparent; border-color:transparent; border-radius:6px;
                         border-width:1px;  display:flexbox; padding:20px 300px 10px 10px; text-align:center;
                         text-decoration:none; border-style: inherit;"
                        href="${this.data.redirectUrl}">
                        
                    </a>
                    <br><br>
                    De antemano, agradecemos tu colaboración, y esperamos que tengas un grandioso día.
                    <br><br><br><br>
                    La información de este correo ha sido generada automáticamente por el 
                    <b>Sistema de Gestión del Proyecto Mentores</b>.
                    <br><br>
                    
                    <div id="correo" style="color: #ffffff; text-align: right; font-size: 17px;">
                        <blockquote>
                            <p><br>
                            Si tienes dudas o requieres mayor información, contáctate con <br>bigomez@utpl.edu.ec
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </p>
                        </blockquote>
                    </div>
                    </blockquote> 
                </P>
            </div>   
        </body>
        </html>
            `
    }
}
