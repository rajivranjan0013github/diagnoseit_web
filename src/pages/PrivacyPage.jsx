import { useNavigate, useParams } from 'react-router-dom';
import { Globe } from 'lucide-react';

const translations = {
    en: {
        title: "Privacy",
        subtitle: "Policy",
        effectiveLabel: "Effective Date",
        updatedLabel: "Last Updated",
        date: "July 31, 2025",
        intro: "Diagnose It: Clinical Cases is handled by Thousand Ways Private Limited. We are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our app.",
        sections: [
            {
                title: "1. Information We Collect",
                list: [
                    { label: "Google Account Information", text: "When you log in via Google Sign-In, we collect your email address and basic profile details (such as your name) as permitted." },
                    { label: "Usage Data", text: "We may collect anonymized data for analytics and performance monitoring." }
                ]
            },
            {
                title: "2. How We Use Your Information",
                items: ["To allow you to log in securely.", "To improve and personalize your app experience."]
            },
            {
                title: "3. Data Storage",
                text: "All data is stored securely on our own servers or databases. We do not sell or share your personal information with third parties."
            },
            {
                title: "4. Your Rights",
                text: "You may request to access, delete, or export your data by emailing us at admin@thethousandways.com. If you are unable to access your account, please contact us, and we will verify your identity before processing your request."
            },
            {
                title: "5. Account Deletion",
                text: "To request account deletion, please email us at admin@thethousandways.com from your logged-in email address. Include your request for account deletion in the email body.",
                subtext: "We will verify your identity using your logged-in email address and process your deletion request within 30 days. Upon deletion, all your personal data, including account information, will be permanently removed from our systems."
            },
            {
                title: "6. Children's Privacy",
                text: "We do not restrict use based on age, but we recommend supervision for children under 13 where required by local laws."
            },
            {
                title: "7. Changes to This Policy",
                text: "We may update this Privacy Policy periodically. Changes will be posted in-app or on our website with a revised effective date."
            },
            {
                title: "8. In-App Purchases",
                text1: "We offer in-app purchases and subscriptions that are processed securely through Google Play Billing / Apple App Store Payments and managed using RevenueCat. We do not store or have access to your full payment details such as credit or debit card numbers.",
                text2: "RevenueCat may collect information related to purchase history (such as subscription status or transaction identifiers) to enable subscription management and access to premium features. For more details on RevenueCat's privacy practices, please review their privacy policy on their website."
            },
            {
                title: "9. Push Notifications",
                text1: "We use Firebase Cloud Messaging (FCM) to send push notifications related to updates, reminders, or other app-related information. Firebase may collect device-level identifiers (such as a device token) needed to deliver notifications.",
                text2: "You can disable notifications at any time through your device settings. We do not use notifications for marketing without your permission, and we do not share notification data with third parties."
            },
            {
                title: "10. Third-Party Service Providers",
                text: "We use the following third-party tools to support core app features:",
                items: [
                    "RevenueCat – Subscription and purchase management.",
                    "Firebase Cloud Messaging – Push notifications.",
                    "Google Sign-In – Authentication."
                ],
                footer: "These tools may collect certain non-personal technical information required for their services."
            },
            {
                title: "11. Contact",
                type: "contact",
                preamble: "If you possess concerns or require further explanations regarding our privacy habits, please contact:",
                company: "Thousand Ways private limited",
                address: "Dariyapur, Bodh Gaya, Bihar 824237, India",
                phone: "+91 9942000425",
                email: "admin@thethousandways.com"
            }
        ]
    },
    de: {
        title: "Daten",
        subtitle: "schutz",
        effectiveLabel: "Inkrafttreten",
        updatedLabel: "Zuletzt aktualisiert",
        date: "31. Juli 2025",
        intro: "Diagnose It: Klinische Fälle wird von Thousand Ways Private Limited verwaltet. Wir verpflichten uns zum Schutz Ihrer Privatsphäre. Diese Datenschutzrichtlinie beschreibt, wie wir Ihre persönlichen Daten erfassen, verwenden und schützen, wenn Sie unsere App nutzen.",
        sections: [
            {
                title: "1. Informationen, die wir sammeln",
                list: [
                    { label: "Google-Kontoinformationen", text: "Wenn Sie sich über Google Sign-In anmelden, erfassen wir Ihre E-Mail-Adresse und grundlegende Profildetails (wie Ihren Namen), soweit zulässig." },
                    { label: "Nutzungsdaten", text: "Wir können anonymisierte Daten für Analysen und Leistungsüberwachung sammeln." }
                ]
            },
            {
                title: "2. Wie wir Ihre Informationen verwenden",
                items: ["Um Ihnen eine sichere Anmeldung zu ermöglichen.", "Um Ihr App-Erlebnis zu verbessern und zu personalisieren."]
            },
            {
                title: "3. Datenspeicherung",
                text: "Alle Daten werden sicher auf unseren eigenen Servern oder in Datenbanken gespeichert. Wir verkaufen oder teilen Ihre persönlichen Informationen nicht mit Dritten."
            },
            {
                title: "4. Ihre Rechte",
                text: "Sie können den Zugriff, die Löschung oder den Export Ihrer Daten beantragen, indem Sie uns eine E-Mail an admin@thethousandways.com senden. Wenn Sie keinen Zugriff auf Ihr Konto haben, kontaktieren Sie uns bitte, und wir werden Ihre Identität überprüfen, bevor wir Ihre Anfrage bearbeiten."
            },
            {
                title: "5. Kontolöschung",
                text: "Um die Löschung Ihres Kontos zu beantragen, senden Sie uns bitte eine E-Mail an admin@thethousandways.com von Ihrer angemeldeten E-Mail-Adresse. Geben Sie Ihren Wunsch nach Kontolöschung im E-Mail-Text an.",
                subtext: "Wir werden Ihre Identität anhand Ihrer angemeldeten E-Mail-Adresse überprüfen und Ihre Löschanfrage innerhalb von 30 Tagen bearbeiten. Nach der Löschung werden alle Ihre persönlichen Daten, einschließlich der Kontoinformationen, dauerhaft aus unseren Systemen entfernt."
            },
            {
                title: "6. Datenschutz für Kinder",
                text: "Wir beschränken die Nutzung nicht nach Alter, empfehlen jedoch die Aufsicht für Kinder unter 13 Jahren, sofern dies durch lokale Gesetze erforderlich ist."
            },
            {
                title: "7. Änderungen an dieser Richtlinie",
                text: "Wir können diese Datenschutzrichtlinie regelmäßig aktualisieren. Änderungen werden in der App oder auf unserer Website mit einem überarbeiteten Inkrafttretensdatum veröffentlicht."
            },
            {
                title: "8. In-App-Käufe",
                text1: "Wir bieten In-App-Käufe und Abonnements an, die sicher über Google Play Billing / Apple App Store Payments abgewickelt und über RevenueCat verwaltet werden. Wir speichern keine vollständigen Zahlungsdetails wie Kredit- oder Debitkartennummern und haben auch keinen Zugriff darauf.",
                text2: "RevenueCat kann Informationen im Zusammenhang mit der Kaufhistorie (z. B. Abonnementstatus oder Transaktionskennungen) sammeln, um die Abonnementverwaltung und den Zugriff auf Premium-Funktionen zu ermöglichen. Weitere Einzelheiten zu den Datenschutzpraktiken von RevenueCat finden Sie in deren Datenschutzrichtlinie auf deren Website."
            },
            {
                title: "9. Push-Benachrichtigungen",
                text1: "Wir verwenden Firebase Cloud Messaging (FCM), um Push-Benachrichtigungen in Bezug auf Updates, Erinnerungen oder andere app-bezogene Informationen zu senden. Firebase kann Identifikatoren auf Geräteebene (z. B. einen Geräte-Token) erfassen, die für die Zustellung von Benachrichtigungen erforderlich sind.",
                text2: "Sie können Benachrichtigungen jederzeit über Ihre Geräteeinstellungen deaktivieren. Wir verwenden Benachrichtigungen nicht ohne Ihre Erlaubnis für Marketingzwecke und geben keine Benachrichtigungsdaten an Dritte weiter."
            },
            {
                title: "10. Drittanbieter",
                text: "Wir verwenden die folgenden Tools von Drittanbietern, um Kernfunktionen der App zu unterstützen:",
                items: [
                    "RevenueCat – Abonnement- und Kaufverwaltung.",
                    "Firebase Cloud Messaging – Push-Benachrichtigungen.",
                    "Google Sign-In – Authentifizierung."
                ],
                footer: "Diese Tools können bestimmte nicht-persönliche technische Informationen erfassen, die für ihre Dienste erforderlich sind."
            },
            {
                title: "11. Kontakt",
                type: "contact",
                preamble: "Wenn Sie Bedenken haben oder weitere Erläuterungen zu unseren Datenschutzpraktiken benötigen, kontaktieren Sie uns bitte:",
                company: "Thousand Ways private limited",
                address: "Dariyapur, Bodh Gaya, Bihar 824237, Indien",
                phone: "+91 9942000425",
                email: "admin@thethousandways.com"
            }
        ]
    },
    fr: {
        title: "Politique de",
        subtitle: "Confidentialité",
        effectiveLabel: "Date d'entrée en vigueur",
        updatedLabel: "Dernière mise à jour",
        date: "31 juillet 2025",
        intro: "Diagnose It : Cas cliniques est géré par Thousand Ways Private Limited. Nous nous engageons à protéger votre vie privée. Cette politique de confidentialité décrit comment nous collectons, utilisons et protégeons vos informations personnelles lorsque vous utilisez notre application.",
        sections: [
            {
                title: "1. Informations que nous collectons",
                list: [
                    { label: "Informations du compte Google", text: "Lorsque vous vous connectez via Google Sign-In, nous collectons votre adresse e-mail et les détails de base de votre profil (tels que votre nom) comme autorisé." },
                    { label: "Données d'utilisation", text: "Nous pouvons collecter des données anonymisées à des fins d'analyse et de suivi des performances." }
                ]
            },
            {
                title: "2. Comment nous utilisons vos informations",
                items: ["Pour vous permettre de vous connecter en toute sécurité.", "Pour améliorer et personnaliser votre expérience sur l'application."]
            },
            {
                title: "3. Stockage des données",
                text: "Toutes les données sont stockées en toute sécurité sur nos propres serveurs ou bases de données. Nous ne vendons ni ne partageons vos informations personnelles avec des tiers."
            },
            {
                title: "4. Vos droits",
                text: "Vous pouvez demander l'accès, la suppression ou l'exportation de vos données en nous envoyant un e-mail à admin@thethousandways.com. Si vous ne pouvez pas accéder à votre compte, veuillez nous contacter et nous vérifierons votre identité avant de traiter votre demande."
            },
            {
                title: "5. Suppression de compte",
                text: "Pour demander la suppression de votre compte, veuillez nous envoyer un e-mail à admin@thethousandways.com à partir de votre adresse e-mail connectée. Incluez votre demande de suppression de compte dans le corps de l'e-mail.",
                subtext: "Nous vérifierons votre identité à l'aide de votre adresse e-mail connectée et traiterons votre demande de suppression dans un délai de 30 jours. Après la suppression, toutes vos données personnelles, y compris les informations de compte, seront définitivement supprimées de nos systèmes."
            },
            {
                title: "6. Confidentialité des enfants",
                text: "Nous ne limitons pas l'utilisation en fonction de l'âge, mais nous recommandons la surveillance des enfants de moins de 13 ans lorsque les lois locales l'exigent."
            },
            {
                title: "7. Modifications de cette politique",
                text: "Nous pouvons mettre à jour cette politique de confidentialité périodiquement. Les modifications seront publiées dans l'application ou sur notre site Web avec une date d'entrée en vigueur révisée."
            },
            {
                title: "8. Achats intégrés",
                text1: "Nous proposons des achats intégrés et des abonnements qui sont traités en toute sécurité via Google Play Billing / Apple App Store Payments et gérés à l'aide de RevenueCat. Nous ne stockons pas et n'avons pas accès à vos informations de paiement complètes telles que les numéros de carte de crédit ou de débit.",
                text2: "RevenueCat peut collecter des informations liées à l'historique des achats (telles que le statut de l'abonnement ou les identifiants de transaction) pour permettre la gestion des abonnements et l'accès aux fonctionnalités premium. Pour plus de détails sur les pratiques de confidentialité de RevenueCat, veuillez consulter leur politique de confidentialité sur leur site Web."
            },
            {
                title: "9. Notifications push",
                text1: "Nous utilisons Firebase Cloud Messaging (FCM) pour envoyer des notifications push liées aux mises à jour, rappels ou autres informations liées à l'application. Firebase peut collecter des identifiants au niveau de l'appareil (tels qu'un jeton d'appareil) nécessaires pour diffuser les notifications.",
                text2: "Vous pouvez désactiver les notifications à tout moment via les paramètres de votre appareil. Nous n'utilisons pas les notifications à des fins de marketing sans votre autorisation et nous ne partageons pas les données de notification avec des tiers."
            },
            {
                title: "10. Prestataires de services tiers",
                text: "Nous utilisons les outils tiers suivants pour prendre en charge les fonctionnalités de base de l'application :",
                items: [
                    "RevenueCat – Gestion des abonnements et des achats.",
                    "Firebase Cloud Messaging – Notifications push.",
                    "Google Sign-In – Authentification."
                ],
                footer: "Ces outils peuvent collecter certaines informations techniques non personnelles requises pour leurs services."
            },
            {
                title: "11. Contact",
                type: "contact",
                preamble: "Si vous avez des préoccupations ou si vous avez besoin d'explications supplémentaires concernant nos pratiques en matière de confidentialité, veuillez nous contacter :",
                company: "Thousand Ways private limited",
                address: "Dariyapur, Bodh Gaya, Bihar 824237, Inde",
                phone: "+91 9942000425",
                email: "admin@thethousandways.com"
            }
        ]
    },
    es: {
        title: "Política de",
        subtitle: "Privacidad",
        effectiveLabel: "Fecha de vigencia",
        updatedLabel: "Última actualización",
        date: "31 de julio de 2025",
        intro: "Diagnose It: Casos Clínicos es gestionado por Thousand Ways Private Limited. Estamos comprometidos a proteger su privacidad. Esta Política de Privacidad describe cómo recopilamos, usamos y protegemos su información personal cuando utiliza nuestra aplicación.",
        sections: [
            {
                title: "1. Información que recopilamos",
                list: [
                    { label: "Información de la cuenta de Google", text: "Cuando inicia sesión a través de Google Sign-In, recopilamos su dirección de correo electrónico y detalles básicos del perfil (como su nombre) según lo permitido." },
                    { label: "Datos de uso", text: "Podemos recopilar datos anonimizados para análisis y monitoreo del rendimiento." }
                ]
            },
            {
                title: "2. Cómo usamos su información",
                items: ["Para permitirle iniciar sesión de forma segura.", "Para mejorar y personalizar su experiencia en la aplicación."]
            },
            {
                title: "3. Almacenamiento de datos",
                text: "Todos los datos se almacenan de forma segura en nuestros propios servidores o bases de datos. No vendemos ni compartimos su información personal con terceros."
            },
            {
                title: "4. Sus derechos",
                text: "Puede solicitar acceder, eliminar o exportar sus datos enviándonos un correo electrónico a admin@thethousandways.com. Si no puede acceder a su cuenta, contáctenos y verificaremos su identidad antes de procesar su solicitud."
            },
            {
                title: "5. Eliminación de cuenta",
                text: "Para solicitar la eliminación de su cuenta, envíenos un correo electrónico a admin@thethousandways.com desde su dirección de correo electrónico registrada. Incluya su solicitud de eliminación de cuenta en el cuerpo del mensaje.",
                subtext: "Verificaremos su identidad utilizando su dirección de correo electrónico registrada y procesaremos su solicitud de eliminación en un plazo de 30 días. Tras la eliminación, todos sus datos personales, incluida la información de la cuenta, se eliminarán de forma permanente de nuestros sistemas."
            },
            {
                title: "6. Privacidad infantil",
                text: "No restringimos el uso por edad, pero recomendamos la supervisión de niños menores de 13 años cuando lo exijan las leyes locales."
            },
            {
                title: "7. Cambios en esta política",
                text: "Podemos actualizar esta Política de Privacidad periódicamente. Los cambios se publicarán en la aplicación o en nuestro sitio web con una fecha de vigencia revisada."
            },
            {
                title: "8. Compras integradas",
                text1: "Ofrecemos compras y suscripciones dentro de la aplicación que se procesan de forma segura a través de Google Play Billing / Apple App Store Payments y se gestionan mediante RevenueCat. No almacenamos ni tenemos acceso a sus datos de pago completos, como números de tarjeta de crédito o débito.",
                text2: "RevenueCat puede recopilar información relacionada con el historial de compras (como el estado de la suscripción o identificadores de transacciones) para permitir la gestión de suscripciones y el acceso a funciones premium. Para obtener más detalles sobre las prácticas de privacidad de RevenueCat, revise su política de privacidad en su sitio web."
            },
            {
                title: "9. Notificaciones push",
                text1: "Usamos Firebase Cloud Messaging (FCM) para enviar notificaciones push relacionadas con actualizaciones, recordatorios u otra información relacionada con la aplicación. Firebase puede recopilar identificadores a nivel de dispositivo (como un token de dispositivo) necesarios para entregar notificaciones.",
                text2: "Puede desactivar las notificaciones en cualquier momento a través de los ajustes de su dispositivo. No utilizamos notificaciones para marketing sin su permiso y no compartimos datos de notificaciones con terceros."
            },
            {
                title: "10. Proveedores de servicios externos",
                text: "Utilizamos las siguientes herramientas de terceros para soportar las funciones principales de la aplicación:",
                items: [
                    "RevenueCat – Gestión de suscripciones y compras.",
                    "Firebase Cloud Messaging – Notificaciones push.",
                    "Google Sign-In – Autenticación."
                ],
                footer: "Estas herramientas pueden recopilar cierta información técnica no personal requerida para sus servicios."
            },
            {
                title: "11. Contacto",
                type: "contact",
                preamble: "Si tiene alguna pregunta, comuníquese con nosotros en admin@thethousandways.com."
            }
        ]
    }
};

export default function PrivacyPolicyPage() {
    const { lang: urlLang } = useParams();
    const navigate = useNavigate();
    
    // Default to 'en' if no lang or invalid lang in URL
    const lang = (urlLang && translations[urlLang.toLowerCase()]) ? urlLang.toLowerCase() : 'en';
    const t = translations[lang];

    const handleLangChange = (newLang) => {
        navigate(`/privacy/${newLang}`);
    };

    return (
        <main className="min-h-screen bg-background text-foreground pb-20">
            {/* Language Dropdown */}
            <div className="flex justify-center pt-8">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm hover:border-gray-200 transition-colors">
                    <Globe className="h-4 w-4 text-primary" />
                    <select 
                        value={lang} 
                        onChange={(e) => handleLangChange(e.target.value)}
                        className="text-xs font-black uppercase bg-transparent border-none outline-none focus:ring-0 cursor-pointer text-gray-700 pr-2"
                        style={{ background: 'none' }}
                    >
                        <option value="en">English (EN)</option>
                        <option value="de">Deutsch (DE)</option>
                        <option value="fr">Français (FR)</option>
                        <option value="es">Español (ES)</option>
                    </select>
                </div>
            </div>

            <section className="container mx-auto px-4 py-8 max-w-3xl">
                <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-center text-balance">
                    {t.title} <span className="text-primary">{t.subtitle}</span>
                </h1>
                <p className="text-sm text-muted-foreground italic text-center mb-8">
                    <span className="font-semibold">{t.effectiveLabel}:</span> {t.date} •{" "}
                    <span className="font-semibold">{t.updatedLabel}:</span> {t.date}
                </p>

                <p className="text-base md:text-lg text-foreground leading-relaxed mb-8 text-center">
                    {t.intro}
                </p>

                <div className="space-y-8">
                    {t.sections.map((section, idx) => (
                        <section key={idx}>
                            <h2 className="text-xl md:text-2xl font-bold mb-3">{section.title}</h2>
                            
                            {section.list && (
                                <ul className="space-y-2 text-muted-foreground">
                                    {section.list.map((item, i) => (
                                        <li key={i}>
                                            <span className="font-semibold">{item.label}:</span> {item.text}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {section.items && (
                                <ul className="space-y-2 text-muted-foreground">
                                    {section.items.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            )}

                            {section.text && (
                                <p className="text-muted-foreground">
                                    {section.text}
                                </p>
                            )}
                            
                            {section.subtext && (
                                <p className="text-muted-foreground mt-3">
                                    {section.subtext}
                                </p>
                            )}

                            {section.text1 && (
                                <p className="text-muted-foreground mb-3">{section.text1}</p>
                            )}
                            {section.text2 && (
                                <p className="text-muted-foreground">{section.text2}</p>
                            )}

                            {section.type === "contact" && (
                                <div className="mt-4 bg-muted/30 p-6 rounded-3xl border border-muted/50">
                                    <p className="text-muted-foreground mb-6 font-medium leading-relaxed">
                                        {section.preamble}
                                    </p>
                                    <div className="space-y-3">
                                        <p className="text-foreground font-black uppercase text-sm tracking-widest">{section.company}</p>
                                        <p className="text-muted-foreground text-sm leading-relaxed">{section.address}</p>
                                        <p className="text-muted-foreground text-sm font-bold">Phone: {section.phone}</p>
                                        <p className="text-muted-foreground text-sm">
                                            Email: <a href={`mailto:${section.email}`} className="text-primary font-bold hover:underline">{section.email}</a>
                                        </p>
                                    </div>
                                </div>
                            )}

                            {section.footer && (
                                <p className="text-muted-foreground mt-3">
                                    {section.footer}
                                </p>
                            )}
                        </section>
                    ))}
                </div>
                <div className="text-center mt-12 pb-10 border-t border-muted/20 pt-8">
                    <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest italic">
                        &copy; 2025 Thousand Ways Private Limited. All Rights Reserved.
                    </p>
                </div>
            </section>
        </main>
    );
}
