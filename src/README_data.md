# Definizione dei punteggi
Il punteggio 'punteggio facilità estrazione dati' corrisponde all'ultima colonna nel file 'src/data/dati.json' ed è stato stimato a	partire	da alcune considerazioni: ai comuni nei quali i file contenenenti i dati erano in formato excel, csv, o esportabili tramite interfaccia web	è stato	assegnato un punteggio più alto, ai comuni nei quali i dati erano salvati in formato  pdf, un punteggio più basso.
# Formule utlizzate per	calcolare i punteggi
I punteggi: 'punteggio uniformità formato dati' e 'punteggio completezza dati' sono stati calcolati a partire dalla tabella in 'src/data/dati.json' con il seguente codice R:

    file <- "/Users/esterpantaleo/src/daf-d3-react-amministrazione_trasparente/src/raw_data.csv";
    comuni.df <- read.table(file, sep=";", header=T)

    uniformita_formato_dati = c();
    punteggio_facilita_estrazione_dati = c();
    comuni = c();
    numero_di_dati = c();
    punteggio_completezza_dati = c();
    comp = 0;
    num = 0;

    for (i in 1:nrow(comuni.df)) {
        if (comuni.df[i,1] != comuni.df[i-1,1] && i > 1) {
	    punteggio_facilita_estrazione_dati = c(punteggio_facilita_estrazione_dati,comuni.df[i-1,14]);
	    uniformita_formato_dati = c(uniformita_formato_dati, comuni.df[i-1,13]);
	    comuni = c(comuni,toString(comuni.df[i-1,1]));
	    punteggio_completezza_dati = c(punteggio_completezza_dati,comp);
	    comp = 0;
	    numero_di_dati = c(numero_di_dati, num);
	    num = 0
	}
	if (comuni.df[i,2] == "Segretario Generale") {
	    comp = comp + 0.5 * 0.5 + 0.5 * (sum(comuni.df[i,5:12])) * 0.5 / 8;
	    num = sum(comuni.df[i,3:12])
	}
	if (comuni.df[i,2] == "Dirigenti") {
	    comp = comp + 0.5 * 0.5 + 0.5 * (sum(comuni.df[i,5:12])) * 0.5 / 8;
	    num = num + sum(comuni.df[i, 3:12])
	}
    }

    punteggio_uniformita_formato_dati = uniformita_formato_dati * numero_di_dati / 18;

    punteggio_medio = (punteggio_uniformita_formato_dati + punteggio_facilita_estrazione_dati + punteggio_completezza_dati) / 3;

    file2 <- "residents.csv";
    residents.df <- read.table(file2, sep=",", header=F)
    comuni_tutti = residents.df[,4]
    numero_di_residenti = residents.df[,7]
    
    header = cbind("COMUNE", "punteggio_uniformita_formato_dati", "punteggio_facilita_estrazione_dati", "punteggio_completezza_dati", "punteggio_medio", "numero_di_residenti")
    H = length(header)
    x = cbind(comuni,punteggio_uniformita_formato_dati, punteggio_facilita_estrazione_dati, punteggio_completezza_dati, punteggio_medio, rep(0, length(comuni)))
        
    for (i in 1:length(comuni_tutti)) {
        index = match(comuni_tutti[i], comuni)
	if (is.na(index)){
	    x = rbind(x, c(toString(comuni_tutti[i]), rep(0, H-2), numero_di_residenti[i]))
	} else {
            x[index, H] = numero_di_residenti[i]
 	}
    }
    x = rbind(header, x)

    #install.packages('jsonlite')
    print(toJSON(x, header=T))   
    write.table(x, file = "data.csv",
      append = FALSE, sep = ";", quote=FALSE)


Il massimo valore di 'numero_di_dati' è pari a 18 nel caso in cui il Comune ha messo a disposizione degli utenti i dati relativi agli stipendi tutti gli anni dal 2009 al 2017 (9 anni) sia per i Segretari Generali che per i Dirigenti del proprio Coume.

#Preparing list of number of residents for "Comuni in Provincia di Bari"
cat /Users/esterpantaleo/src/TEAM_DIGITALE/data_and_documents/Istat/Resident\ population\ \ on\ 1st\ January\ Comuni/DCIS_POPRES1_Data_f14c2e28-665e-4e27-a9c7-7bc40f27d0d8.csv | LC_ALL=C grep -f comuni_in_provincia_bari.csv | LC_ALL=C grep '"totale","totale"' | LC_ALL=C grep -v maschi | LC_ALL=C grep -v femmine | LC_ALL=C tr -d "\"" > residents.csv