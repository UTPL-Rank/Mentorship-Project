import { IEmailTemplate } from "../i-email-template";
import { IWelcomeEmailData } from "./i-welcome-email-data";

export class WelcomeEmail implements IEmailTemplate<IWelcomeEmailData>{

    public constructor(
        public readonly data: IWelcomeEmailData
    ) { }

    public html(): string {
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
                    style="color: #222222; font-family: Arial, Helvetica, sans-serif; font-size: 18px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400">Hola,
                    ${this.data.displayName}
                </span>
            </div>

            <div style="font-family: inherit; text-align: inherit">
                <br>
            </div>

            <div style="font-family: inherit; text-align: inherit">
                <span
                    style="color: #222222; font-family: Arial, Helvetica, sans-serif; font-size: 18px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400">
                    Te saludamos desde el Equipo del Proyecto Mentores, y bienvenido a al nuevo Sistema para el Acompañamiento
                    Memorial, el cual puedes acceder a través del siguiente enlace: ${this.data.url}.
                </span>
            </div>

            <td align="center" bgcolor="#007bff" class="inner-td"
                style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;">
                <a href="${this.data.url}"
                    style="background-color:#007bff; border:1px solid #007bff; border-color:#007bff; border-radius:6px; border-width:1px; color:#ffffff; display:inline-block; font-size:14px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:12px 18px 12px 18px; text-align:center; text-decoration:none; border-style:solid;"
                    target="_blank">
                    Visita el Sistema de Gestión Mentorial
                </a>
            </td>

            <div style="font-family: inherit; text-align: inherit">
                <span
                    style="color: #222222; font-family: Arial, Helvetica, sans-serif; font-size: 18px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400">
                    El acceso es solo para usuarios UTPL, y tus roles, serán asignados automáticamente, pero si hay algún problema
                    no dudes en contactarnos a proyectomentores@utpl.edu.ec
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

            <div>
                La información de este correo ha sido generada automáticamente por el Sistema de Gestión del Proyecto Mentores. Si
                tienes dudas o quieres notificar alguna falta, contactanos a <strong>proyectomentores@utpl.edu.ec</strong>.
            </div>
            `
    }
}