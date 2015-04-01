package com.lenovo.law.thread;

import java.util.concurrent.Callable;

public interface IWorkTask extends Callable<Object>{

	public Object call();
}
