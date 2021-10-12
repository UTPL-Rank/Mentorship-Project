import { IEmailTemplate } from "../i-email-template";
import { INeverRegisterAccompanimentEmailData } from "./i-never-register-accompaniment-email-data";

export class NeverRegisterAccompanimentEmail implements IEmailTemplate<INeverRegisterAccompanimentEmailData> {

    public constructor(
        public readonly data: INeverRegisterAccompanimentEmailData,
    ) { }

    public html(): string {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Notificacion Mentores No Registran</title>
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
                    height: 1030px;
                    /*background-image: url(NOTIFICACION\ MENTORES\ QUE\ NO\ REGISTRA\ ACOMPAÑAMIENTO-07v2.png);*/
                    background-image: url(https://github.com/dani117m/notificaciones/blob/main/notificaciones/NOTIFICACION%20MENTORES%20QUE%20NO%20REGISTRA%20ACOMPA%C3%91AMIEN.png?raw=true);
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
                    <br><br>
                    Te notificamos que, al momento, cuentas con <b>cero (0)</b> acompañamientos registrados.
                    <br><br>
                    Recuerda que el apoyo brindado a tus estudiantes es de suma importancia para facilitar
                    su adaptación a la vida universitaria, por lo que te solicitamos de favor, realizar el
                    acompañamiento y registrarlo oportunamente a través de la plataforma, para ello,
                    usa el siguiente <b>enlace:</b>
                    <br><br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <a
                        style="background-color:transparent; border-color:transparent; border-radius:6px;
                         border-width:1px;  display:flexbox; padding:25px 300px 10px 5px; text-align:center;
                         text-decoration:none; border-style: inherit;"
                        href="${this.data.redirectUrl}">
                        
                    </a>
                    <br><br>
                    De antemano, agradecemos tu colaboración, y esperamos que tengas un grandioso día.
                    <br><br><br><br>
                    La información de este correo ha sido generada automáticamente por el 
                    <b>Sistema de Gestión del Proyecto Mentores</b>.
                    <br><br><br>
                    <div id="correo" style="color: #ffffff; text-align: right; font-size: 17px;">
                        <blockquote>
                            <p>
                            Si tienes dudas o requieres mayor información, contáctate con <br>bigomez@utpl.edu.ec
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
