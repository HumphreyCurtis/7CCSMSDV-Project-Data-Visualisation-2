package com.company;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;

public class WriteJSONFile {

    public static JSONArray vaccinationsData = new JSONArray();
    public static JSONArray totalData = new JSONArray();

    public static void writeFile(ArrayList<Country> nations, World worldwideData) {

        for (int i=0; i<nations.size(); i++) {
            Country indexedNation = nations.get(i);
//            System.out.println(indexedNation.getName());
//            System.out.println(indexedNation.getTotalVaccinations());
            JSONObject countryData = createJSONObjectFromNationsData(indexedNation);
            vaccinationsData.add(countryData);
        }

        /* Top 5 Occurrences */
//        for (int i=0; i<nations.size(); i++) {
//            Country indexedNation = nations.get(i);
//            if (indexedNation.getTotalVaccinationsAsProportionOfWorld()!=null) {
//                if (Math.round(indexedNation.getTotalVaccinationsAsProportionOfWorld()) > 3) {
//                    System.out.println(indexedNation.getName());
//                    System.out.println(indexedNation.getTotalVaccinations());
//                    JSONObject countryData = createJSONObjectFromNationsData(indexedNation);
//                    vaccinationsData.add(countryData);
//                }
//            }
//        }

//        JSONObject worldData = createJSONObjectFromWorldData(worldwideData);


        try (FileWriter file = new FileWriter("februaryVaccinationData.json")){

            file.write(vaccinationsData.toJSONString());
            file.flush();

        } catch(IOException e) {
            e.printStackTrace();
        }

    }

    public static JSONObject createJSONObjectFromWorldData(World world) {
        JSONObject worldData = new JSONObject();

        String peopleVaccinated = world.getPeopleVaccinated().toString();
        String totalVaccinations = world.getTotalVaccinations().toString();

        worldData.put("name", "Worldwide");
        worldData.put("iso_code", "OWID_WRL");
        worldData.put("numberOfPeopleVaccinated", peopleVaccinated);
        worldData.put("totalOfVaccinations", totalVaccinations);

        return worldData;
    }

    public static JSONObject createJSONObjectFromNationsData(Country indexedNation) {
        JSONObject countryData = new JSONObject();
        String countryName;
        String ISOCode;
        String peopleVaccinated;
        String totalVaccinations;
        String peopleVaccinatedProportionally;
        String totalVaccinatedProportionally;

        if (indexedNation.getName()!=null) {
            countryName = indexedNation.getName();
        } else {
            countryName = null;
        }

        if (indexedNation.getISO_Code()!=null) {
            ISOCode = indexedNation.getISO_Code();
        } else {
            ISOCode = null;
        }

        if (indexedNation.getTotalVaccinations()!=null) {
            totalVaccinations = indexedNation.getTotalVaccinations().toString();
        } else {
            totalVaccinations = null;
        }

        if (indexedNation.getPeopleVaccinated()!=null) {
            peopleVaccinated = indexedNation.getPeopleVaccinated().toString();
        } else {
            peopleVaccinated = null;
        }

        if (indexedNation.getPeopleVaccinatedAsProportionOfWorld()!=null) {
            peopleVaccinatedProportionally = indexedNation.getPeopleVaccinatedAsProportionOfWorld().toString();
        } else {
            peopleVaccinatedProportionally = null;
        }

        if (indexedNation.getTotalVaccinationsAsProportionOfWorld()!=null) {
            totalVaccinatedProportionally = indexedNation.getTotalVaccinationsAsProportionOfWorld().toString();
        } else {
            totalVaccinatedProportionally = null;
        }

        countryData.put("name", countryName);
        countryData.put("iso_code", ISOCode);
        countryData.put("peopleVaccinated", peopleVaccinated);
        countryData.put("totalVaccinations", totalVaccinations);
        countryData.put("peopleVaccinatedAsProportionGlobally", peopleVaccinatedProportionally);
        countryData.put("totalVaccinationsAsProportionGlobally", totalVaccinatedProportionally);

        return countryData;
    }

}
