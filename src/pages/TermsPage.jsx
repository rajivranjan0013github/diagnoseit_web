import { useNavigate, useParams } from 'react-router-dom';
import { Globe } from 'lucide-react';

const translations = {
    en: {
        title: "Terms and",
        subtitle: "Conditions",
        effectiveLabel: "Effective Date",
        date: "July 31, 2025",
        intro: "Diagnose It: Clinical Cases is handled by Thousand Ways Private Limited. Welcome to Diagnose It: Clinical Cases. By accessing or using our app and services, you agree to be bound by these Terms and Conditions.",
        sections: [
            {
                title: "1. Eligibility",
                text: "Our services are intended for individuals who can use the app responsibly. You must be able to enter into legally binding agreements to use our services. By using the app, you represent that you are of legal age or have parental consent where required."
            },
            {
                title: "2. Accounts",
                text: "To access medical cases and scoring, users must create an account by logging in via Google Sign-In. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.",
                subtext: "If you lose access to your account and want your data removed, please contact us at admin@thethousandways.com. We reserve the right to verify your identity before processing such requests."
            },
            {
                title: "3. Subscription and Payments",
                text: "Our services may require a paid subscription, which is managed and processed securely through Apple App Store and Google Play Store in-app billing. We use RevenueCat for subscription lifecycle management.",
                extra: "Refunds, cancellations, and renewals are handled by the respective app stores under their standard terms and refund policies. We do not have direct access to your credit card or payment information."
            },
            {
                title: "4. Prohibited Activities",
                text: "You agree not to misuse the platform. Prohibited activities include, but are not limited to: unauthorized access to our systems, interfering with the service security, reverse engineering the app's code, or using the service for any illegal purposes."
            },
            {
                title: "5. Content and Intellectual Property",
                text: "All clinical cases, medical scenarios, diagnostic logic, content, branding, and images on this app are the intellectual property of Thousand Ways Private Limited. Reproduction, distribution, or commercial use without express written permission is strictly prohibited.",
                subtext: "We analyze anonymized usage data and performance metrics to improve the accuracy of our simulations and provide a better learning experience."
            },
            {
                title: "6. Medical Disclaimer",
                text: "IMPORTANT: This app is an educational simulation tool for learning purposes only. The clinical cases, symptoms, and scenarios are virtual training exercises and do not constitute professional medical advice, diagnosis, or treatment.",
                extra: "We are not responsible for any clinical decisions made in real-world practice based on this educational content. Always consult qualified healthcare professionals and official medical guidelines for actual patient diagnosis and treatment."
            },
            {
                title: "7. Limitation of Liability",
                text: "To the maximum extent permitted by law, Thousand Ways Private Limited shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our services."
            },
            {
                title: "8. Termination",
                text: "We reserve the right to suspend or terminate your access to the app at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users or our business interests."
            },
            {
                title: "9. Changes to Terms",
                text: "We reserve the right to update or modify these Terms at any time. Significant changes will be announced in-app. Your continued use of the service following the posting of changes constitutes your acceptance of such changes."
            },
            {
                title: "10. Contact Us",
                type: "contact",
                preamble: "If you possess concerns or require further explanations regarding our Terms and Conditions, please contact:",
                company: "Thousand Ways private limited",
                address: "Dariyapur, Bodh Gaya, Bihar 824237, India",
                email: "admin@thethousandways.com"
            }
        ]
    },
    de: {
        title: "Allgemeine",
        subtitle: "Geschäftsbedingungen",
        effectiveLabel: "Inkrafttreten",
        date: "31. Juli 2025",
        intro: "Diagnose It: Klinische Fälle wird von Thousand Ways Private Limited verwaltet. Willkommen bei Diagnose It: Klinische Fälle. Durch den Zugriff auf unsere App und Dienste erklären Sie sich mit diesen Allgemeinen Geschäftsbedingungen einverstanden.",
        sections: [
            {
                title: "1. Berechtigung",
                text: "Unsere Dienste sind für Personen gedacht, die die App verantwortungsbewusst nutzen können. Sie müssen in der Lage sein, rechtlich bindende Vereinbarungen zu treffen. Durch die Nutzung der App erklären Sie, dass Sie volljährig sind oder gegebenenfalls die Zustimmung Ihrer Eltern haben."
            },
            {
                title: "2. Konten",
                text: "Um auf medizinische Fälle und Punktzahlen zuzugreifen, müssen Benutzer ein Konto durch Anmeldung über Google Sign-In erstellen. Sie sind für die Wahrung der Vertraulichkeit Ihrer Zugangsdaten und für alle Aktivitäten unter Ihrem Konto verantwortlich.",
                subtext: "Wenn Sie den Zugriff auf Ihr Konto verlieren und die Löschung Ihrer Daten wünschen, kontaktieren Sie uns bitte unter admin@thethousandways.com. Wir behalten uns das Recht vor, Ihre Identität vor der Bearbeitung solcher Anfragen zu überprüfen."
            },
            {
                title: "3. Abonnement und Zahlungen",
                text: "Unsere Dienste erfordern möglicherweise ein kostenpflichtiges Abonnement, das sicher über Apple App Store und Google Play Store In-App-Abrechnung verarbeitet wird. Wir nutzen RevenueCat für die Verwaltung des Abonnement-Lebenszyklus.",
                extra: "Rückerstattungen, Kündigungen und Verlängerungen werden von den jeweiligen App-Stores gemäß deren Standardbedingungen und Rückerstattungsrichtlinien abgewickelt. Wir haben keinen direkten Zugriff auf Ihre Kreditkarten- oder Zahlungsinformationen."
            },
            {
                title: "4. Verbotene Aktivitäten",
                text: "Sie erklären sich damit einverstanden, die Plattform nicht zu missbrauchen. Zu den verbotenen Aktivitäten gehören unter anderem: unbefugter Zugriff auf unsere Systeme, Störung der Dienstsicherheit, Reverse Engineering des App-Codes oder die Nutzung des Dienstes für illegale Zwecke."
            },
            {
                title: "5. Inhalt und geistiges Eigentum",
                text: "Alle klinischen Fälle, medizinischen Szenarien, die Diagnoselogik, Inhalte, Marken und Bilder in dieser App sind geistiges Eigentum von Thousand Ways Private Limited. Die Vervielfältigung, Verbreitung oder gewerbliche Nutzung ohne ausdrückliche schriftliche Genehmigung ist streng untersagt.",
                subtext: "Wir analysieren anonymisierte Nutzungsdaten und Leistungskennzahlen, um die Genauigkeit unserer Simulationen zu verbessern und ein besseres Lernerlebnis zu bieten."
            },
            {
                title: "6. Medizinischer Haftungsausschluss",
                text: "WICHTIG: Diese App ist ein pädagogisches Simulationswerkzeug ausschließlich zu Lernzwecken. Die klinischen Fälle, Symptome und Szenarien sind virtuelle Trainingsübungen und stellen keine professionelle medizinische Beratung, Diagnose oder Behandlung dar.",
                extra: "Wir sind nicht verantwortlich für klinische Entscheidungen, die in der realen Praxis auf der Grundlage dieser Bildungsinhalte getroffen werden. Konsultieren Sie für die tatsächliche Diagnose und Behandlung von Patienten immer qualifiziertes medizinisches Fachpersonal und offizielle medizinische Richtlinien."
            },
            {
                title: "7. Haftungsbeschränkung",
                text: "Soweit gesetzlich zulässig, haftet Thousand Ways Private Limited nicht für direkte, indirekte, zufällige, besondere oder Folgeschäden, die aus der Nutzung oder der Unfähigkeit zur Nutzung unserer Dienste resultieren."
            },
            {
                title: "8. Kündigung",
                text: "Wir behalten uns das Recht vor, Ihren Zugriff auf die App nach eigenem Ermessen und ohne Vorankündigung zu sperren oder zu kündigen, wenn wir der Meinung sind, dass Ihr Verhalten gegen diese Bedingungen verstößt oder anderen Benutzern oder unseren Geschäftsinteressen schadet."
            },
            {
                title: "9. Änderungen der Bedingungen",
                text: "Wir behalten uns das Recht vor, diese Bedingungen jederzeit zu aktualisieren oder zu ändern. Wesentliche Änderungen werden in der App bekannt gegeben. Ihre fortgesetzte Nutzung des Dienstes nach der Veröffentlichung von Änderungen stellt Ihre Annahme dieser Änderungen dar."
            },
            {
                title: "10. Kontakt",
                type: "contact",
                preamble: "Wenn Sie Bedenken haben oder weitere Erläuterungen zu unseren Geschäftsbedingungen benötigen, kontaktieren Sie uns bitte:",
                company: "Thousand Ways private limited",
                address: "Dariyapur, Bodh Gaya, Bihar 824237, Indien",
                email: "admin@thethousandways.com"
            }
        ]
    },
    fr: {
        title: "Conditions",
        subtitle: "Générales",
        effectiveLabel: "Date d'entrée en vigueur",
        date: "31 juillet 2025",
        intro: "Diagnose It : Cas cliniques est géré par Thousand Ways Private Limited. Bienvenue sur Diagnose It : Cas cliniques. En accédant ou en utilisant notre application et nos services, vous acceptez d'être lié par ces conditions générales.",
        sections: [
            {
                title: "1. Éligibilité",
                text: "Nos services sont destinés aux personnes capables d'utiliser l'application de manière responsable. Vous devez être en mesure de conclure des accords juridiquement contraignants. En utilisant l'application, vous déclarez que vous avez l'âge légal ou que vous avez le consentement de vos parents si nécessaire."
            },
            {
                title: "2. Comptes",
                text: "Pour accéder aux cas médicaux et aux scores, les utilisateurs doivent créer un compte en se connectant via Google Sign-In. Vous êtes responsable du maintien de la confidentialité de vos identifiants de connexion et de toutes les activités qui se déroulent sous votre compte.",
                subtext: "Si vous perdez l'accès à votre compte et souhaitez que vos données soient supprimées, veuillez nous contacter à admin@thethousandways.com. Nous nous réservons le droit de vérifier votre identité avant de traiter de telles demandes."
            },
            {
                title: "3. Abonnement et paiements",
                text: "Nos services peuvent nécessiter un abonnement payant, qui est géré et traité en toute sécurité via la facturation intégrée de l'Apple App Store et du Google Play Store. Nous utilisons RevenueCat pour la gestion du cycle de vie des abonnements.",
                extra: "Les remboursements, les annulations et les renouvellements sont gérés par les magasins d'applications respectifs selon leurs conditions standard et leurs politiques d'un remboursement. Nous n'avons pas d'accès direct à vos informations de carte de crédit ou de paiement."
            },
            {
                title: "4. Activités interdites",
                text: "Vous acceptez de ne pas abuser de la plateforme. Les activités interdites incluent, mais ne sont pas limitées à : l'accès non autorisé à nos systèmes, l'interférence avec la sécurité du service, l'ingénierie inverse du code de l'application ou l'utilisation du service à des fins illégales."
            },
            {
                title: "5. Contenu et propriété intellectuelle",
                text: "Tous les cas cliniques, scénarios médicaux, logique de diagnostic, contenu, image de marque et images de cette application sont la propriété intellectuelle de Thousand Ways Private Limited. La reproduction, la distribution ou l'utilisation commerciale sans autorisation écrite expresse est strictement interdite.",
                subtext: "Nous analysons les données d'utilisation anonymisées et les mesures de performance pour améliorer la précision de nos simulations et offrir une meilleure expérience d'apprentissage."
            },
            {
                title: "6. Avis de non-responsabilité médicale",
                text: "IMPORTANT : Cette application est un outil de simulation pédagogique à des fins d'apprentissage uniquement. Les cas cliniques, les symptômes et les scénarios sont des exercices de formation virtuels et ne constituent pas un avis médical professionnel, un diagnostic ou un traitement.",
                extra: "Nous ne sommes pas responsables des décisions cliniques prises dans la pratique réelle sur la base de ce contenu éducatif. Consultez toujours des professionnels de la santé qualifiés et les directives médicales officielles pour le diagnostic et le traitement réels des patients."
            },
            {
                title: "7. Limitation de responsabilité",
                text: "Dans la mesure maximale permise par la loi, Thousand Ways Private Limited ne sera pas responsable des dommages directs, indirects, accessoires, spéciaux ou consécutifs résultant de l'utilisation ou de l'impossibilité d'utiliser nos services."
            },
            {
                title: "8. Résiliation",
                text: "Nous nous réservons le droit de suspendre ou de résilier votre accès à l'application à notre seule discrétion, sans préavis, pour toute conduite que nous estimons violer ces conditions ou être préjudiciable aux autres utilisateurs ou à nos intérêts commerciaux."
            },
            {
                title: "9. Modifications des conditions",
                text: "Nous nous réservons le droit de mettre à jour ou de modifier ces conditions à tout moment. Les changements importants seront annoncés dans l'application. Votre utilisation continue du service après la publication des modifications constitue votre acceptation de ces modifications."
            },
            {
                title: "10. Contact",
                type: "contact",
                preamble: "Si vous avez des préoccupations ou avez besoin d'explications supplémentaires concernant nos conditions générales, veuillez nous contacter :",
                company: "Thousand Ways private limited",
                address: "Dariyapur, Bodh Gaya, Bihar 824237, Inde",
                email: "admin@thethousandways.com"
            }
        ]
    },
    es: {
        title: "Términos y",
        subtitle: "Condiciones",
        effectiveLabel: "Fecha de vigencia",
        updatedLabel: "Última actualización",
        date: "31 de julio de 2025",
        intro: "Diagnose It: Casos Clínicos es gestionado por Thousand Ways Private Limited. Bienvenido a Diagnose It: Casos Clínicos. Al acceder o utilizar nuestra aplicación y servicios, usted acepta cumplir con estos Términos y Condiciones.",
        sections: [
            {
                title: "1. Elegibilidad",
                text: "Nuestros servicios están destinados a personas que puedan utilizar la aplicación de forma responsable. Debe ser capaz de celebrar acuerdos legalmente vinculantes. Al usar la aplicación, declara que tiene la edad legal o que cuenta con el consentimiento de sus padres cuando sea necesario."
            },
            {
                title: "2. Cuentas",
                text: "Para acceder a los casos médicos y a las puntuaciones, los usuarios deben crear una cuenta iniciando sesión a través de Google Sign-In. Usted es responsable de mantener la confidencialidad de sus credenciales de acceso y de todas las actividades que ocurran bajo su cuenta.",
                subtext: "Si pierde el acceso a su cuenta y desea que se eliminen sus datos, póngase en contacto con nosotros en admin@thethousandways.com. Nos reservamos el derecho de verificar su identidad antes de procesar dichas solicitudes."
            },
            {
                title: "3. Suscripción y pagos",
                text: "Nuestros servicios pueden requerir una suscripción de pago, que se gestiona y procesa de forma segura a través de la facturación integrada de Apple App Store y Google Play Store. Utilizamos RevenueCat para la gestión del ciclo de vida de las suscripciones.",
                extra: "Los reembolsos, cancelaciones y renovaciones son gestionados por las respectivas tiendas de aplicaciones bajo sus términos estándar y políticas de reembolso. No tenemos acceso directo a su tarjeta de crédito o información de pago."
            },
            {
                title: "4. Actividades prohibidas",
                text: "Usted acepta no hacer un uso indebido de la plataforma. Las actividades prohibidas incluyen, entre otras: el acceso no autorizado a nuestros sistemas, la interferencia con la seguridad del servicio, la ingeniería inversa del código de la aplicación o el uso del servicio para fines ilegales."
            },
            {
                title: "5. Contenido y propiedad intelectual",
                text: "Todos los casos clínicos, escenarios médicos, lógica de diagnóstico, contenido, marca e imágenes de esta aplicación son propiedad intelectual de Thousand Ways Private Limited. Queda estrictamente prohibida la reproducción, distribución o uso comercial sin el permiso expreso por escrito.",
                subtext: "Analizamos datos de uso anónimos y métricas de rendimiento para mejorar la precisión de nuestras simulaciones y ofrecer una mejor experiencia de aprendizaje."
            },
            {
                title: "6. Descargo de responsabilidad médica",
                text: "IMPORTANTE: Esta aplicación es una herramienta de simulación educativa solo para fines de aprendizaje. Los casos clínicos, síntomas y escenarios son ejercicios de entrenamiento virtuales y no constituyen asesoramiento médico profesional, diagnóstico ni tratamiento.",
                extra: "No nos hacemos responsables de ninguna decisión clínica tomada en la práctica real basada en este contenido educativo. Consulte siempre a profesionales de la salud cualificados y las guías médicas oficiales para el diagnóstico y tratamiento real de los pacientes."
            },
            {
                title: "7. Limitación de responsabilidad",
                text: "En la medida máxima permitida por la ley, Thousand Ways Private Limited no será responsable de ningún daño directo, indirecto, incidental, especial o consecuente derivado del uso o la imposibilidad de uso de nuestros servicios."
            },
            {
                title: "8. Terminación",
                text: "Nos reservamos el derecho de suspender o cancelar su acceso a la aplicación a nuestra entera discreción, sin previo aviso, por conductas que consideremos que infringen estos Términos o que sean perjudiciales para otros usuarios o nuestros intereses comerciales."
            },
            {
                title: "9. Cambios en los términos",
                text: "Nos reservamos el derecho de actualizar o modificar estos Términos en cualquier momento. Los cambios significativos se anunciarán en la aplicación. El uso continuado del servicio tras la publicación de los cambios constituye su aceptación de dichos cambios."
            },
            {
                title: "10. Contacto",
                type: "contact",
                preamble: "Si tiene dudas o necesita más explicaciones sobre nuestros Términos y Condiciones, póngase en contacto con nosotros:",
                company: "Thousand Ways private limited",
                address: "Dariyapur, Bodh Gaya, Bihar 824237, India",
                email: "admin@thethousandways.com"
            }
        ]
    },
    it: {
        title: "Termini e",
        subtitle: "Condizioni",
        effectiveLabel: "Data di entrata in vigore",
        date: "31 luglio 2025",
        intro: "Diagnose It: Clinical Cases è gestito da Thousand Ways Private Limited. Benvenuto in Diagnose It: Clinical Cases. Accedendo o utilizzando la nostra app e i nostri servizi, accetti di essere vincolato dai presenti Termini e Condizioni.",
        sections: [
            {
                title: "1. Idoneità",
                text: "I nostri servizi sono destinati a persone che possono utilizzare l'app in modo responsabile. Devi essere in grado di stipulare accordi legalmente vincolanti per utilizzare i nostri servizi. Utilizzando l'app, dichiari di aver raggiunto l'età legale o di avere il consenso dei genitori, se richiesto."
            },
            {
                title: "2. Account",
                text: "Per accedere ai casi medici e ai punteggi, gli utenti devono creare un account accedendo tramite Google Sign-In. Sei responsabile del mantenimento della riservatezza delle tue credenziali di accesso e di tutte le attività che si verificano sotto il tuo account.",
                subtext: "Se perdi l'accesso al tuo account e desideri la rimozione dei tuoi dati, contattaci all'indirizzo admin@thethousandways.com. Ci riserviamo il diritto di verificare la tua identità prima di elaborare tali richieste."
            },
            {
                title: "3. Abbonamento e Pagamenti",
                text: "I nostri servizi potrebbero richiedere un abbonamento a pagamento, gestito ed elaborato in modo sicuro tramite la fatturazione in-app di Apple App Store e Google Play Store. Utilizziamo RevenueCat per la gestione del ciclo di vita degli abbonamenti.",
                extra: "Rimborsi, cancellazioni e rinnovi sono gestiti dai rispettivi app store in base ai loro termini standard e alle politiche di rimborso. Non abbiamo accesso diretto alla tua carta di credito o alle informazioni di pagamento."
            },
            {
                title: "4. Attività Vietate",
                text: "Accetti di non utilizzare la piattaforma in modo improprio. Le attività vietate includono, a titolo esemplificativo: accesso non autorizzato ai nostri sistemi, interferenza con la sicurezza del servizio, reverse engineering del codice dell'app o utilizzo del servizio per scopi illegali."
            },
            {
                title: "5. Contenuti e Proprietà Intellettuale",
                text: "Tutti i casi clinici, gli scenari medici, la logica diagnostica, i contenuti, i marchi e le immagini presenti su questa app sono di proprietà intellettuale di Thousand Ways Private Limited. La riproduzione, distribuzione o utilizzo commerciale senza l'espresso consenso scritto è severamente vietata.",
                subtext: "Analizziamo i dati sull'utilizzo e le metriche sulle prestazioni in forma anonima per migliorare la precisione delle nostre simulazioni e offrire una migliore esperienza di apprendimento."
            },
            {
                title: "6. Esclusione di Responsabilità Medica",
                text: "IMPORTANTE: Questa app è uno strumento di simulazione didattica esclusivamente a scopo di apprendimento. I casi clinici, i sintomi e gli scenari sono esercizi di formazione virtuali e non costituiscono consulenza medica professionale, diagnosi o trattamento.",
                extra: "Non siamo responsabili per eventuali decisioni cliniche prese nella pratica reale basate su questi contenuti educativi. Consulta sempre operatori sanitari qualificati e le linee guida mediche ufficiali per la diagnosi e il trattamento effettivi del paziente."
            },
            {
                title: "7. Limitazione di Responsabilità",
                text: "Nella misura massima consentita dalla legge, Thousand Ways Private Limited non sarà responsabile per eventuali danni diretti, indiretti, incidentali, speciali o consequenziali derivanti dall'uso o dall'impossibilità di utilizzare i nostri servizi."
            },
            {
                title: "8. Risoluzione",
                text: "Ci riserviamo il diritto di sospendere o interrompere il tuo accesso all'app a nostra esclusiva discrezione, senza preavviso, per comportamenti che riteniamo violino i presenti Termini o siano dannosi per altri utenti o per i nostri interessi commerciali."
            },
            {
                title: "9. Modifiche ai Termini",
                text: "Ci riserviamo il diritto di aggiornare o modificare i presenti Termini in qualsiasi momento. Modifiche significative verranno annunciate all'interno dell'app. L'uso continuato del servizio dopo la pubblicazione delle modifiche costituisce l'accettazione delle stesse."
            },
            {
                title: "10. Contattaci",
                type: "contact",
                preamble: "In caso di dubbi o se richiedi ulteriori spiegazioni sui nostri Termini e Condizioni, ti preghiamo di contattarci:",
                company: "Thousand Ways private limited",
                address: "Dariyapur, Bodh Gaya, Bihar 824237, India",
                email: "admin@thethousandways.com"
            }
        ]
    }
};

export default function TermsOfServicePage() {
    const { lang: urlLang } = useParams();
    const navigate = useNavigate();
    
    // Default to 'en' if no lang or invalid lang in URL
    const lang = (urlLang && translations[urlLang.toLowerCase()]) ? urlLang.toLowerCase() : 'en';
    const t = translations[lang];

    const handleLangChange = (newLang) => {
        navigate(`/terms/${newLang}`);
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
                        <option value="it">Italiano (IT)</option>
                    </select>
                </div>
            </div>

            <section className="container mx-auto px-4 py-8 max-w-3xl">
                <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-center text-balance">
                    {t.title} <span className="text-primary">{t.subtitle}</span>
                </h1>
                <p className="text-sm text-muted-foreground italic text-center mb-8">
                    <span className="font-semibold">{t.effectiveLabel}:</span> {t.date}
                </p>

                <p className="text-base md:text-lg text-foreground leading-relaxed mb-8 text-center">
                    {t.intro}
                </p>

                <div className="space-y-8">
                    {t.sections.map((section, idx) => (
                        <section key={idx}>
                            <h2 className="text-xl md:text-2xl font-bold mb-3">{section.title}</h2>
                            
                            {section.text && (
                                <p className="text-muted-foreground">
                                    {section.text}
                                </p>
                            )}

                            {section.subtext && (
                                <p className="text-muted-foreground mt-3 italic">
                                    {section.subtext}
                                </p>
                            )}

                            {section.extra && (
                                <p className="text-muted-foreground mt-3 font-medium">
                                    {section.extra}
                                </p>
                            )}

                            {section.type === "contact" && (
                                <div className="mt-4 bg-muted/30 p-6 rounded-3xl border border-muted/50">
                                    <p className="text-muted-foreground mb-6 font-medium leading-relaxed">
                                        {section.preamble}
                                    </p>
                                    <div className="space-y-3">
                                        <p className="text-foreground font-black uppercase text-sm tracking-widest">{section.company}</p>
                                        <p className="text-muted-foreground text-sm leading-relaxed">{section.address}</p>
                                        <p className="text-muted-foreground text-sm">
                                            Email: <a href={`mailto:${section.email}`} className="text-primary font-bold hover:underline">{section.email}</a>
                                        </p>
                                    </div>
                                </div>
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
