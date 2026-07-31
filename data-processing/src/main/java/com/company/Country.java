package com.company;

public class Country {
    private String name;
    private String ISO_Code;
    private Long peopleVaccinated;
    private Long totalVaccinations;
    private Double peopleVaccinatedAsProportionOfWorld;
    private Double totalVaccinationsAsProportionOfWorld;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getISO_Code() {
        return ISO_Code;
    }

    public void setISO_Code(String ISO_Code) {
        this.ISO_Code = ISO_Code;
    }

    public Long getPeopleVaccinated() {
        return peopleVaccinated;
    }

    public void setPeopleVaccinated(Long peopleVaccinated) {
        this.peopleVaccinated = peopleVaccinated;
    }

    public Long getTotalVaccinations() {
        return totalVaccinations;
    }

    public void setTotalVaccinations(Long totalVaccinations) {
        this.totalVaccinations = totalVaccinations;
    }

    public Double getPeopleVaccinatedAsProportionOfWorld() {
        return peopleVaccinatedAsProportionOfWorld;
    }

    public void setPeopleVaccinatedAsProportionOfWorld(Double peopleVaccinatedAsProportionOfWorld) {
        this.peopleVaccinatedAsProportionOfWorld = peopleVaccinatedAsProportionOfWorld;
    }

    public Double getTotalVaccinationsAsProportionOfWorld() {
        return totalVaccinationsAsProportionOfWorld;
    }

    public void setTotalVaccinationsAsProportionOfWorld(Double totalVaccinationsAsProportionOfWorld) {
        this.totalVaccinationsAsProportionOfWorld = totalVaccinationsAsProportionOfWorld;
    }

}
