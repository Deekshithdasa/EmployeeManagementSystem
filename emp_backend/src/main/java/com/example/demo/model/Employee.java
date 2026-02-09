package com.example.demo.model;
import java.time.LocalDate;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

@Entity 
@Table(name="employees_table")
public class Employee {

	
	public Employee() {}
	
	public Employee(Long id, String name, String gender, String email, String dateOfJoin, Long salary, String department) {
		super();
		this.id = id;
		this.name = name;
		this.gender = gender;
		this.email = email;
		this.dateOfJoin = dateOfJoin;
		this.salary = salary;
		this.department = department;
	}
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name="name", nullable = false)
	private String name;
	
	@Column(name="gender")
	private String gender;
	
	@Column(name="email", nullable = false)
	private String email;
	
	@Column(name="date_of_join")
	private String dateOfJoin;
	
	@Column(name="salary")
	private Long salary;
	
	@Column(name="department")
	private String department;
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getDateOfJoin() {
		return dateOfJoin;
	}

	public void setDateOfJoin(String dateOfJoin) {
		this.dateOfJoin = dateOfJoin;
	}

	public Long getSalary() {
		return salary;
	}

	public void setSalary(Long salary) {
		this.salary = salary;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	@Override
	public String toString() {
		return "Employee [id=" + id + ", name=" + name + ", gender=" + gender + ", email=" + email
				+ ", dateOfJoin=" + dateOfJoin + ", salary=" + salary + ", department=" + department + "]";
	}
	
	
	
}
