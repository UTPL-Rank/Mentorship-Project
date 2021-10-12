import { IEmailTemplate } from "../i-email-template";
import { IValidateAccompanimentEmailData } from "./i-validate-accompaniment-email-data";

export class ValidateAccompanimentEmail implements IEmailTemplate<IValidateAccompanimentEmailData>{

    public constructor(
        public readonly data: IValidateAccompanimentEmailData,
    ) { }

    public html(): string {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>validacion</title>
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
                    height: 1020px;
                    /*background-image: url(VALIDACION-05v2.png) ;*/
                    background-image: url(https://github.com/dani117m/notificaciones/blob/main/notificaciones/VALIDACION.png?raw=true) ;
                    margin: 0  auto;
                    padding: 0;
                }
        
        
            </style>
        </head>
        <body> 
            <div id="contenedor" style="color: #0c3a5a; font-size: 21px; font-family: Arial;">
        
                <br><br><br><br><br><br><br>
                <br><br><br><br><br><br><br>
                <br><br><br>
                <P>
                    <blockquote>
                    Desde el <b>Equipo del Proyecto Mentores</b>, 
                    te damos de nuevo la bienvenida a la <b>UTPL</b>,
                    deseándote muchos exitos en tu carrera.
                    <br><br>
                    Para nosotros, es muy importante conocer tu opinión respecto al acompañamiento
                    que recibes de tu <b>Mentor</b>, razón por la que a lo largo del semestre
                    recibirás estas notificaciones para que valides y valores el mismo.
                    <br><br>
                    Accede al siguiente <b>enlace</b> para calificar al acompañamiento:
                    <br><br><br>
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
                    La información de este correo ha sido generada automáticamente por el <b>Sistema
                        de Gestión del Proyecto Mentores.
                    </b>
                    </blockquote> 
                    <br>
                    <div id="correo" style="color: #ffffff; text-align: right; font-size: 18px;">
                    <blockquote>
                        <p>
                        Si tienes dudas o requieres mayor información, contáctate con <br>bigomez@utpl.edu.ec
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </p>
                    </blockquote>
                    </div>
                    
                </P>
            </div>  
        </body>
        </html>
    `
    }

}
