import { IEmailTemplate } from "../i-email-template";
import { INeverRegisterAccompanimentEmailData } from "./i-never-register-accompaniment-email-data";

export class NeverRegisterAccompanimentEmail implements IEmailTemplate<INeverRegisterAccompanimentEmailData> {

    public constructor(
        public readonly data: INeverRegisterAccompanimentEmailData,
    ) { }

    public html(): string {
        // Modifica HTML con el correo que se enviará a los mentores
        // que nunca han registrado un acompañamiento
        return `
            <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center">
                <img class="max-width" border="0"
                    style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px;"
                    width="300" src="https://www.utpl.edu.ec/manual_imagen/images/institucional/UTPL-INSTITUCIONAL-FC.jpg" alt=""
                    height="" data-proportionally-constrained="false" data-responsive="false">
            </td>

            <div>
                <span style="font-size:18px;">
                    <strong>Vicerrectorado Académico</strong>
                </span>
                <br>
                <strong>Proyecto Mentores</strong>
            </div>

            <div style="font-family: inherit; text-align: inherit">
                <br>
            </div>

            <div style="font-family: inherit; text-align: inherit">
                <span
                    style="color: #222222; font-family: Arial, Helvetica, sans-serif; font-size: 18px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400">
                    Hola, ${this.data.mentorName}
                </span>
            </div>

            <div style="font-family: inherit; text-align: inherit">
                <br>
            </div>

            <div style="font-family: inherit; text-align: inherit">
                <span
                    style="color: #222222; font-family: Arial, Helvetica, sans-serif; font-size: 18px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400">
                    Te saludamos desde el Equipo del Proyecto Mentores, y queremos recordarte para que realices y registres los acompañamientos en la plataforma de mentores.
                </span>
                <span
                    style="color: #222222; font-family: Arial, Helvetica, sans-serif; font-size: 18px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400">.
                    Accede a traves del siguiente enlace para registrar un acompañamiento.&nbsp;
                </span>
            </div>

            <td align="center" bgcolor="#007bff" class="inner-td"
                style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;">
                <a style="background-color:#007bff; border:1px solid #007bff; border-color:#007bff; border-radius:6px; border-width:1px; color:#ffffff; display:inline-block; font-family:arial,helvetica,sans-serif; font-size:16px; font-weight:normal; letter-spacing:0px; line-height:16px; padding:12px 18px 12px 18px; text-align:center; text-decoration:none; border-style:solid;"
                    href="${this.data.redirectUrl}" target="_blank">
                    Registrar Acompañamiento
                </a>
            </td>


            <div style="font-family: inherit; text-align: inherit">
                <br>
            </div>

            <div style="font-family: inherit; text-align: inherit"><span
                    style="color: #222222; font-family: Arial, Helvetica, sans-serif; font-size: 18px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400">
                    De antemano, agradecemos tu colaboración, y esperamos que tengas un grandioso día 👍.
                </span>
            </div>

            <div style="font-family: inherit; text-align: inherit">
                <br>
            </div>

            <div style="font-family: inherit; text-align: inherit">
                <span
                    style="color: #222222; font-family: Arial, Helvetica, sans-serif; font-size: 18px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400">
                    Atentamente, el Equipo de Proyecto Mentores.
                </span>
            </div>

            <div style="font-family: inherit; text-align: inherit">
                <br>
            </div>


            <div>
                La información de este correo ha sido generada automáticamente por el Sistema de Gestión del Proyecto Mentores. Si
                tienes dudas o quieres notificar alguna falta, contactanos a <strong>proyectomentores@utpl.edu.ec</strong>. 
            </div>
            `
    }



}
